import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper function to convert 12-hour to 24-hour format
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Helper function to add an hour to time
function addHour(time24h) {
  const [hours, minutes] = time24h.split(':');
  const newHours = (parseInt(hours, 10) + 1).toString().padStart(2, '0');
  return `${newHours}:${minutes}`;
}

// Validate environment variables
function validateEnvVars() {
  const requiredVars = [
    'MAILTRAP_HOST',
    'MAILTRAP_PORT',
    'MAILTRAP_USER',
    'MAILTRAP_PASS',
    'MAILTRAP_FROM_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI'
  ];
  const missingVars = requiredVars.filter(key => !process.env[key]);
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}

async function sendConfirmationEmail(customerData, appointmentData, meetingLink) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: process.env.MAILTRAP_PORT === '465',
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D9E8FF; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0040A8; padding: 20px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0;">Akbar Tax Store</h1>
      </div>
      
      <div style="padding: 20px; background-color: #FFFFFF;">
        <h2 style="color: #072971;">Appointment Confirmation</h2>
        <p>Hello ${customerData.firstName},</p>
        <p>Your tax consultation has been scheduled successfully. Here are the details:</p>
        
        <div style="background-color: #D9E8FF; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Service Type:</strong> ${appointmentData.serviceType}</p>
          <p><strong>Date:</strong> ${appointmentData.date}</p>
          <p><strong>Time:</strong> ${appointmentData.time}</p>
          ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">Join Meeting</a></p>` : ''}
          ${appointmentData.message ? `<p><strong>Your Notes:</strong> ${appointmentData.message}</p>` : ''}
        </div>
        
        <p style="color: #050505;">Need to reschedule or cancel? Please contact us at least 24 hours before your appointment.</p>
        
        <p>Best regards,<br/>The Akbar Tax Store Team</p>
      </div>
      
      <div style="background-color: #072971; padding: 10px; text-align: center;">
        <p style="color: #FFFFFF; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Akbar Tax Store. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Akbar Tax Store" <${process.env.MAILTRAP_FROM_EMAIL}>`,
    to: customerData.email,
    subject: `Appointment Confirmation - ${appointmentData.date}`,
    html: emailHtml,
    text: `Hello ${customerData.firstName},\n\nYour appointment is scheduled for ${appointmentData.date} at ${appointmentData.time}.\n\nMeeting Link: ${meetingLink || 'Will be sent separately'}\n\nBest regards,\nAkbar Tax Store`
  });
}

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Helper function to refresh tokens if expired
async function refreshTokensIfNeeded(tokens) {
  if (tokens.expiry_date && Date.now() > tokens.expiry_date) {
    oauth2Client.setCredentials(tokens);
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  }
  return tokens;
}

export async function POST(request) {
  try {
    // Validate environment variables
    validateEnvVars();

    // Parse request body
    const { date, time, firstName, lastName, email, phone, serviceType, message } = await request.json();
    
    // Validate required fields
    const missingFields = [];
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!serviceType) missingFields.push('serviceType');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Get tokens from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'Authentication required - no cookies found' },
        { status: 401 }
      );
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = decodeURIComponent(value);
      return acc;
    }, {});

    if (!cookies.google_tokens) {
      return NextResponse.json(
        { error: 'Authentication required - no Google tokens found' },
        { status: 401 }
      );
    }

    let tokens;
    try {
      tokens = JSON.parse(cookies.google_tokens);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid authentication tokens' },
        { status: 401 }
      );
    }

    // Refresh tokens if expired
    try {
      tokens = await refreshTokensIfNeeded(tokens);
      oauth2Client.setCredentials(tokens);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      return NextResponse.json(
        { error: 'Authentication expired - please sign in again' },
        { status: 401 }
      );
    }

    // Create calendar instance
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Convert time and create event with proper timezone
    const timeZone = 'Asia/Karachi';
    const startTime24 = convertTo24Hour(time);
    const endTime24 = addHour(startTime24);
    
    // Create ISO datetime strings with proper timezone
    const startDateTime = new Date(`${date}T${startTime24}:00`).toISOString();
    const endDateTime = new Date(`${date}T${endTime24}:00`).toISOString();

    const event = {
      summary: `Tax Consultation - ${firstName} ${lastName}`,
      description: `Service Type: ${serviceType}\nClient: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}${message ? `\nNotes: ${message}` : ''}`,
      start: {
        dateTime: startDateTime,
        timeZone: timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    // Create the calendar event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    // Send confirmation email
    await sendConfirmationEmail(
      { firstName, lastName, email, phone },
      { date, time, serviceType, message },
      response.data.hangoutLink
    );

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      meetingLink: response.data.hangoutLink,
      calendarEvent: response.data.htmlLink
    });

  } catch (error) {
    console.error('Booking error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response?.data
    });
    
    let errorMessage = 'Failed to schedule meeting';
    let statusCode = 500;
    
    if (error.code === 400) {
      errorMessage = 'Invalid request data';
      statusCode = 400;
    } else if (error.code === 401 || error.code === 403) {
      errorMessage = 'Calendar access denied - please reauthenticate';
      statusCode = 403;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          stack: error.stack
        } : undefined
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Service operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}