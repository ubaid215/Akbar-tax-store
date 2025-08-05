// app/api/calendar/events/route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/calendar']
});

export async function POST(request) {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      attendeeEmail,
      firstName,
      lastName,
      phone,
      serviceType
    } = await request.json();

    // Validate required fields
    if (!title || !startTime || !endTime || !attendeeEmail) {
      return NextResponse.json(
        { error: 'Title, start/end times, and attendee email are required' },
        { status: 400 }
      );
    }

    const calendar = google.calendar({ version: 'v3', auth });

    // Simplified event without conference data
    const event = {
      summary: title,
      description: description || '',
      location: location || '',
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'UTC'
      },
      reminders: {
        useDefault: true
      }
    };

    // Insert event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    // Generate a shareable calendar link
    const eventLink = response.data.htmlLink ||
      `https://calendar.google.com/calendar/event?eid=${encodeURIComponent(btoa(response.data.id))}`;

    // Configure Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });


    const mailOptions = {
      from: `"Akbar Tax Store" <${process.env.MAILTRAP_FROM_EMAIL}>`,
      to: attendeeEmail,
      subject: `Appointment Confirmation: ${serviceType}`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 1px solid #dcdcdc; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #072971; font-size: 24px; margin: 0;">Appointment Confirmed</h1>
        <p style="font-size: 14px; color: #555; margin-top: 8px;">Akbar Tax Store</p>
      </div>

      <p style="font-size: 16px; color: #333;">Hello <strong>${firstName} ${lastName}</strong>,</p>
      <p style="font-size: 16px; color: #333;">Your <strong>${serviceType}</strong> appointment has been successfully scheduled. Here are the details:</p>
      
      <div style="background-color: #f1f7ff; padding: 16px 20px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 8px 0; font-size: 15px;"><strong>Date & Time:</strong> ${new Date(startTime).toLocaleString()}</p>
        <p style="margin: 8px 0; font-size: 15px;"><strong>Service:</strong> ${serviceType}</p>
        <p style="margin: 8px 0; font-size: 15px;"><strong>Phone:</strong> ${phone}</p>
      </div>

      <p style="font-size: 16px; color: #333;">Add this event to your calendar:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${eventLink}" 
           style="display: inline-block; background-color: #0040A8; color: #fff; font-size: 16px; 
                  padding: 12px 24px; border-radius: 5px; text-decoration: none;">
          📅 Add to Google Calendar
        </a>
      </div>

      <p style="font-size: 16px; color: #333;">Thank you for choosing <strong>Akbar Tax Store</strong>! We look forward to serving you.</p>
      
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

      <footer style="text-align: center; font-size: 12px; color: #888;">
        <p>Akbar Tax Store, Your Trusted Partner in Tax Filing & Business Services</p>
        <p style="margin: 4px 0;">This is an automated message. Please do not reply.</p>
      </footer>
    </div>
  `,
      text: `
    Appointment Confirmation - Akbar Tax Store

    Hello ${firstName} ${lastName},

    Your ${serviceType} appointment has been scheduled for ${new Date(startTime).toLocaleString()}.

    Add to your calendar: ${eventLink}

    Thank you for choosing Akbar Tax Store!
  `
    };


    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      eventLink: eventLink,
      message: 'Event created and confirmation email sent'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create event',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}