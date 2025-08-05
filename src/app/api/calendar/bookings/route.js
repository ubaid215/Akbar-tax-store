import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const calendar = google.calendar({ version: 'v3', auth });

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    
    // Process events to extract booked slots
    const bookedSlots = {};
    
    events.forEach(event => {
      if (event.start && event.start.dateTime) {
        const startTime = new Date(event.start.dateTime);
        const dateString = startTime.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Convert to 12-hour format
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        
        if (!bookedSlots[dateString]) {
          bookedSlots[dateString] = [];
        }
        bookedSlots[dateString].push(timeString);
      }
    });

    return NextResponse.json({
      success: true,
      bookedSlots
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch bookings',
        details: error.message
      },
      { status: 500 }
    );
  }
}