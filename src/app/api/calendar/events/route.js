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

    // Create event with proper 1.5-hour duration
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
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${new Date(startTime).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}//${new Date(endTime).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(description || '')}&location=${encodeURIComponent(location || '')}`;

    // Configure Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    // Format start and end times for email display
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const appointmentTimeString = `${startDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })} at ${startDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${endDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} (1.5 hours)`;

    // Email to customer (confirmation)
    const customerMailOptions = {
      from: `"Akbar Tax Store" <${process.env.MAILTRAP_FROM_EMAIL}>`,
      to: attendeeEmail,
      subject: `Appointment Confirmation: ${serviceType}`,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 16px !important; }
          .header { padding: 16px !important; }
          .content { padding: 16px !important; }
          .button { padding: 12px 16px !important; font-size: 14px !important; }
          .appointment-details { padding: 12px !important; }
          .signature-table { width: 100% !important; }
          .signature-table td { display: block !important; text-align: center !important; padding: 8px 0 !important; }
          .signature-logo { margin: 0 auto 10px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #D9E8FF; font-family: Arial, sans-serif;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #D9E8FF;">
        <div style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 12px rgba(5, 5, 5, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #072971 0%, #0040A8 100%); color: #FFFFFF; text-align: center; padding: 32px 24px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Appointment Confirmed</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Akbar Tax Store</p>
          </div>

          <!-- Content -->
          <div class="content" style="padding: 32px 24px;">
            <p style="font-size: 18px; color: #050505; margin: 0 0 16px 0; line-height: 1.5;">Hello <strong style="color: #072971;">${firstName} ${lastName}</strong>,</p>
            
            <p style="font-size: 16px; color: #050505; margin: 0 0 24px 0; line-height: 1.6;">Your <strong style="color: #0040A8;">${serviceType}</strong> appointment has been successfully scheduled. We'll shortly send you the meeting link.</p>
            
            <!-- Appointment Details -->
            <div class="appointment-details" style="background-color: #D9E8FF; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #0040A8;">
              <h3 style="color: #072971; margin: 0 0 16px 0; font-size: 18px;">Appointment Details</h3>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Date & Time:</strong> ${appointmentTimeString}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Service:</strong> ${serviceType}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Duration:</strong> 1.5 hours</p>
            </div>

            <p style="font-size: 16px; color: #050505; margin: 24px 0 16px 0; text-align: center;">Add this event to your calendar:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 24px 0;">
              <a href="${eventLink}" class="button" target="_blank" rel="noopener noreferrer"
                 style="display: inline-block; background: linear-gradient(135deg, #0040A8 0%, #072971 100%); 
                        color: #FFFFFF; font-size: 16px; font-weight: bold; padding: 14px 28px; 
                        border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(0, 64, 168, 0.3);
                        transition: all 0.3s ease;"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0, 64, 168, 0.4)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 64, 168, 0.3)';">
                📅 Add to Google Calendar
              </a>
            </div>

            <p style="font-size: 16px; color: #050505; margin: 24px 0 0 0; line-height: 1.6;">Thank you for choosing <strong style="color: #072971;">Akbar Tax Store</strong>! We look forward to serving you.</p>
          </div>

          <!-- Professional Signature -->
          <div style="background-color: #D9E8FF; padding: 24px; border-top: 1px solid rgba(7, 41, 113, 0.1);">
            <table class="signature-table" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: top; padding-right: 20px;">
                  <div class="signature-logo" style="width: 60px; height: 60px; background: linear-gradient(135deg, #072971 0%, #0040A8 100%); 
                                   border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                    <span style="color: #FFFFFF; font-size: 24px; font-weight: bold;">ATS</span>
                  </div>
                </td>
                <td style="vertical-align: top;">
                  <h4 style="margin: 0 0 8px 0; color: #072971; font-size: 18px; font-weight: bold;">Akbar Tax Store</h4>
                  <p style="margin: 0 0 4px 0; color: #050505; font-size: 14px; line-height: 1.4;">Your Trusted Partner in Tax Filing & Business Services</p>
                  <p style="margin: 0 0 4px 0; color: #0040A8; font-size: 14px;">📧 hussnain@akbartaxstore.com</p>
                  <p style="margin: 0 0 4px 0; color: #0040A8; font-size: 14px;">📞 +923016832064</p>
                  <p style="margin: 0 0 4px 0; color: #0040A8; font-size: 14px;">🌐 www.akbartaxstore.com</p>
                  <div style="margin-top: 12px;">
                    <a href="#" style="display: inline-block; margin-right: 8px; width: 32px; height: 32px; 
                                    background-color: #0040A8; border-radius: 50%; text-decoration: none;
                                    text-align: center; line-height: 32px; color: #FFFFFF; font-size: 14px;">f</a>
                    <a href="#" style="display: inline-block; margin-right: 8px; width: 32px; height: 32px; 
                                    background-color: #0040A8; border-radius: 50%; text-decoration: none;
                                    text-align: center; line-height: 32px; color: #FFFFFF; font-size: 14px;">in</a>
                    <a href="#" style="display: inline-block; width: 32px; height: 32px; 
                                    background-color: #0040A8; border-radius: 50%; text-decoration: none;
                                    text-align: center; line-height: 32px; color: #FFFFFF; font-size: 14px;">@</a>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div style="background-color: #072971; color: #FFFFFF; text-align: center; padding: 20px 24px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.8;">This is an automated confirmation email. Please do not reply to this message.</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.6;">© 2024 Akbar Tax Store. All rights reserved.</p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `,
      text: `
    Appointment Confirmation - Akbar Tax Store

    Hello ${firstName} ${lastName},

    Your ${serviceType} appointment has been scheduled for ${appointmentTimeString}.
    We'll shortly send you the meeting link.

    Add to your calendar: ${eventLink}

    Thank you for choosing Akbar Tax Store!
    
    ---
    Akbar Tax Store
    Your Trusted Partner in Tax Filing & Business Services
    Email: info@akbartaxstore.com
    Phone: +1 (555) 123-4567
    Website: www.akbartaxstore.com
  `
    };

    // Email to website owner (notification)
    const ownerMailOptions = {
      from: `"Akbar Tax Store System" <${process.env.MAILTRAP_FROM_EMAIL}>`,
      to: process.env.OWNER_EMAIL || process.env.MAILTRAP_FROM_EMAIL,
      subject: `New Appointment Booked: ${serviceType} - ${firstName} ${lastName}`,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Appointment Notification</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 16px !important; }
          .header { padding: 16px !important; }
          .content { padding: 16px !important; }
          .button { padding: 12px 16px !important; font-size: 14px !important; }
          .info-box { padding: 12px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #D9E8FF; font-family: Arial, sans-serif;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #D9E8FF;">
        <div style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 12px rgba(5, 5, 5, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #072971 0%, #0040A8 100%); color: #FFFFFF; text-align: center; padding: 32px 24px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔔 New Appointment Booked</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Admin Notification - Akbar Tax Store</p>
          </div>

          <!-- Content -->
          <div class="content" style="padding: 32px 24px;">
            <p style="font-size: 18px; color: #050505; margin: 0 0 24px 0; line-height: 1.5;">A new appointment has been scheduled through your website:</p>
            
            <!-- Client Information -->
            <div class="info-box" style="background-color: #D9E8FF; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #0040A8;">
              <h3 style="color: #072971; margin: 0 0 16px 0; font-size: 18px;">👤 Client Information</h3>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Email:</strong> ${attendeeEmail}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Phone:</strong> ${phone}</p>
            </div>

            <!-- Appointment Details -->
            <div class="info-box" style="background: linear-gradient(135deg, rgba(0, 64, 168, 0.1) 0%, rgba(7, 41, 113, 0.1) 100%); 
                                      padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #072971;">
              <h3 style="color: #072971; margin: 0 0 16px 0; font-size: 18px;">📅 Appointment Details</h3>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Service:</strong> ${serviceType}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Date & Time:</strong> ${appointmentTimeString}</p>
              <p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Duration:</strong> 1.5 hours</p>
              ${location ? `<p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Location:</strong> ${location}</p>` : ''}
              ${description ? `<p style="margin: 8px 0; font-size: 15px; color: #050505;"><strong>Description:</strong> ${description}</p>` : ''}
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${eventLink}" class="button" target="_blank" rel="noopener noreferrer"
                 style="display: inline-block; background: linear-gradient(135deg, #0040A8 0%, #072971 100%); 
                        color: #FFFFFF; font-size: 16px; font-weight: bold; padding: 14px 28px; 
                        border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(0, 64, 168, 0.3);">
                📅 View in Google Calendar
              </a>
            </div>

            <div style="background-color: rgba(5, 5, 5, 0.05); padding: 16px; border-radius: 6px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #050505;"><strong>Event ID:</strong> ${response.data.id}</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(5, 5, 5, 0.7);">Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #072971; color: #FFFFFF; text-align: center; padding: 20px 24px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.8;">This is an automated notification from your Akbar Tax Store booking system</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.6;">© 2024 Akbar Tax Store Admin Panel</p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `,
      text: `
    New Appointment Booked - Akbar Tax Store

    Client: ${firstName} ${lastName}
    Email: ${attendeeEmail}
    Phone: ${phone}
    
    Service: ${serviceType}
    Date & Time: ${appointmentTimeString}
    Duration: 1.5 hours
    
    View in calendar: ${eventLink}
    
    Event ID: ${response.data.id}
    Generated on ${new Date().toLocaleString()}
  `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(ownerMailOptions)
    ]);

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      eventLink: eventLink,
      message: 'Event created and confirmation emails sent to customer and owner'
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