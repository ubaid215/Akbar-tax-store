// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter using Mailtrap SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.MAILTRAP_FROM_EMAIL, // Your verified sender email
      to: 'hussnain@akbartaxstore.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; margin: 0 !important; }
              .header { padding: 20px 15px !important; }
              .content { padding: 20px 15px !important; }
              .card { margin: 0 10px !important; padding: 20px 15px !important; }
              .detail-row { display: block !important; }
              .detail-label { padding: 8px 0 4px 0 !important; display: block !important; width: 100% !important; }
              .detail-value { padding: 0 0 12px 0 !important; display: block !important; width: 100% !important; border-bottom: 1px solid #D9E8FF !important; }
              .message-box { padding: 15px 12px !important; margin-top: 20px !important; }
              .footer { padding: 15px !important; }
              .brand-title { font-size: 24px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #D9E8FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
          <div class="container" style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(7, 41, 113, 0.15);">
            
            <!-- Header -->
            <div class="header" style="background: linear-gradient(135deg, #072971 0%, #0040A8 100%); color: #FFFFFF; padding: 40px 30px; text-align: center; position: relative;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1 class="brand-title" style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">New Contact Inquiry</h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 400;">Akbar Tax Store</p>
            </div>
            
            <!-- Content -->
            <div class="content" style="padding: 40px 30px; background-color: #FFFFFF;">
              <div class="card" style="background: linear-gradient(135deg, #D9E8FF 0%, rgba(217, 232, 255, 0.5) 100%); padding: 30px; border-radius: 12px; border: 1px solid rgba(0, 64, 168, 0.1); position: relative;">
                
                <!-- Decorative elements -->
                <div style="position: absolute; top: -5px; left: -5px; width: 20px; height: 20px; background: #0040A8; border-radius: 50%; opacity: 0.1;"></div>
                <div style="position: absolute; bottom: -3px; right: -3px; width: 15px; height: 15px; background: #072971; border-radius: 50%; opacity: 0.1;"></div>
                
                <h2 style="color: #072971; margin: 0 0 25px 0; font-size: 22px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #0040A8; width: 4px; height: 20px; border-radius: 2px; margin-right: 12px;"></span>
                  Contact Details
                </h2>
                
                <!-- Contact Information -->
                <div style="space-y: 12px;">
                  <div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid rgba(0, 64, 168, 0.1);">
                    <div class="detail-label" style="min-width: 100px; font-weight: 600; color: #072971; display: flex; align-items: center;">
                      <span style="background: #0040A8; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; opacity: 0.7;"></span>
                      Name
                    </div>
                    <div class="detail-value" style="flex: 1; color: #050505; font-weight: 500; padding-left: 20px;">${name}</div>
                  </div>
                  
                  <div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid rgba(0, 64, 168, 0.1);">
                    <div class="detail-label" style="min-width: 100px; font-weight: 600; color: #072971; display: flex; align-items: center;">
                      <span style="background: #0040A8; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; opacity: 0.7;"></span>
                      Email
                    </div>
                    <div class="detail-value" style="flex: 1; color: #050505; font-weight: 500; padding-left: 20px;">
                      <a href="mailto:${email}" style="color: #0040A8; text-decoration: none; font-weight: 600;">${email}</a>
                    </div>
                  </div>
                  
                  <div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid rgba(0, 64, 168, 0.1);">
                    <div class="detail-label" style="min-width: 100px; font-weight: 600; color: #072971; display: flex; align-items: center;">
                      <span style="background: #0040A8; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; opacity: 0.7;"></span>
                      Phone
                    </div>
                    <div class="detail-value" style="flex: 1; color: #050505; font-weight: 500; padding-left: 20px;">
                      ${phone ? `<a href="tel:${phone.replace(/\s/g, '')}" style="color: #0040A8; text-decoration: none; font-weight: 600;">${phone}</a>` : '<span style="color: #999; font-style: italic;">Not provided</span>'}
                    </div>
                  </div>
                  
                  <div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid rgba(0, 64, 168, 0.1);">
                    <div class="detail-label" style="min-width: 100px; font-weight: 600; color: #072971; display: flex; align-items: center;">
                      <span style="background: #0040A8; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; opacity: 0.7;"></span>
                      Subject
                    </div>
                    <div class="detail-value" style="flex: 1; color: #050505; font-weight: 500; padding-left: 20px;">
                      <span style="background: rgba(0, 64, 168, 0.1); color: #0040A8; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">${subject}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Message Section -->
                <div style="margin-top: 30px;">
                  <h3 style="color: #072971; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                    <span style="background: #0040A8; width: 4px; height: 16px; border-radius: 2px; margin-right: 12px;"></span>
                    Message
                  </h3>
                  <div class="message-box" style="background: linear-gradient(135deg, #FFFFFF 0%, rgba(217, 232, 255, 0.3) 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #0040A8; line-height: 1.6; color: #050505; font-size: 15px; box-shadow: 0 2px 8px rgba(0, 64, 168, 0.08);">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>
              
              <!-- Action Note -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(7, 41, 113, 0.05) 0%, rgba(0, 64, 168, 0.05) 100%); border-radius: 10px; border: 1px solid rgba(0, 64, 168, 0.1);">
                <p style="margin: 0; color: #072971; font-size: 14px; text-align: center; font-weight: 500;">
                  💡 <strong>Quick Tip:</strong> Reply directly to this email to respond to the customer
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer" style="background: linear-gradient(135deg, #050505 0%, #072971 100%); color: #FFFFFF; padding: 25px 30px; text-align: center;">
              <div style="margin-bottom: 15px;">
                <div style="background: rgba(255, 255, 255, 0.1); width: 50px; height: 50px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Akbar Tax Store</p>
              <p style="margin: 0; font-size: 13px; opacity: 0.8; line-height: 1.4;">
                This message was sent from your website contact form<br>
                <span style="color: #D9E8FF;">hussnain@akbartaxstore.com</span>
              </p>
              
              <!-- Social Links -->
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="margin: 0 0 10px 0; font-size: 12px; opacity: 0.7;">Connect with us:</p>
                <div style="display: inline-flex; gap: 10px;">
                  <a href="https://wa.me/message/QJQEJZWC36JKN1" style="background: rgba(255, 255, 255, 0.1); width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.3s ease;">
                    <span style="color: #FFFFFF; font-size: 14px;">📱</span>
                  </a>
                  <a href="https://www.instagram.com/_akbar_tax_store" style="background: rgba(255, 255, 255, 0.1); width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.3s ease;">
                    <span style="color: #FFFFFF; font-size: 14px;">📸</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Email client compatibility spacer -->
          <div style="height: 20px; background-color: #D9E8FF;"></div>
        </body>
        </html>
      `,
      // Also include plain text version
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject}
        
        Message:
        ${message}
        
        This message was sent from the Akbar Tax Store contact form.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send email',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}