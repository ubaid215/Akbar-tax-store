// app/api/calendar/bookings/route.js
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
    
    // Define available time slots (matching frontend)
    const availableSlots = [
      { slot: '01:00 PM', startHour: 13, startMinute: 0 },
      { slot: '02:30 PM', startHour: 14, startMinute: 30 },
      { slot: '04:00 PM', startHour: 16, startMinute: 0 },
      { slot: '05:30 PM', startHour: 17, startMinute: 30 },
      { slot: '07:00 PM', startHour: 19, startMinute: 0 },
      { slot: '08:30 PM', startHour: 20, startMinute: 30 },
      { slot: '10:00 PM', startHour: 22, startMinute: 0 }
    ];
    
    // Process events to extract booked slots
    const bookedSlots = {};
    
    events.forEach(event => {
      if (event.start && event.start.dateTime && event.end && event.end.dateTime) {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        
        // Get the date in YYYY-MM-DD format
        const dateString = eventStart.toISOString().split('T')[0];
        
        if (!bookedSlots[dateString]) {
          bookedSlots[dateString] = [];
        }

        // Check which of our available slots conflict with this event
        availableSlots.forEach(slotInfo => {
          // Create the slot's time range
          const slotStart = new Date(eventStart);
          slotStart.setHours(slotInfo.startHour, slotInfo.startMinute, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(slotStart.getHours() + 1, slotStart.getMinutes() + 30); // 1.5 hours
          
          // Check if the event overlaps with this slot
          // Events overlap if: eventStart < slotEnd AND eventEnd > slotStart
          if (eventStart < slotEnd && eventEnd > slotStart) {
            // This slot conflicts with the event, mark it as booked
            if (!bookedSlots[dateString].includes(slotInfo.slot)) {
              bookedSlots[dateString].push(slotInfo.slot);
            }
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      bookedSlots,
      debug: {
        eventsProcessed: events.length,
        dateRange: `${startDate} to ${endDate}`
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch bookings',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}