"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const BookMeetingPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [eventId, setEventId] = useState('');

  const timeSlots = [
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:30 PM',
    '10:00 PM'
  ];

  const serviceTypes = [
    { name: 'Individual Tax Preparation', price: 'From PKR 4000', popular: true },
    { name: 'Business Tax Preperation', price: 'From PKR 7000', popular: true },
    { name: 'Tax Planning & Strategy', price: 'From PKR 1500', popular: false },
    { name: 'IRS Problem Resolution', price: 'From PKR 3000', popular: false },
    { name: 'Bookkeeping Services', price: 'From PKR 7000/month', popular: false },
    { name: 'Payroll Services', price: 'Custom Quote', popular: false },
    { name: 'General Consultation', price: 'Free 45min', popular: true }
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch existing bookings from server to sync with Google Calendar
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        
        const response = await fetch(`/api/calendar/bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        const data = await response.json();
        
        if (data.success) {
          setBookedSlots(data.bookedSlots || {});
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to format date consistently
  const formatDateForStorage = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromStorage = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // FIXED: Convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    
    if (modifier === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes: parseInt(minutes, 10) };
  };

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) return false;
    if (date.getDay() === 0) return false;
    
    return true;
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const isTimeSlotBooked = (date, time) => {
    const dateString = formatDateForStorage(date);
    return bookedSlots[dateString] && bookedSlots[dateString].includes(time);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return timeSlots;
    
    const dateBookedSlots = bookedSlots[selectedDate] || [];
    return timeSlots.filter(slot => !dateBookedSlots.includes(slot));
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateGoogleCalendarURL = (startTime, endTime, title, description, location) => {
    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForGoogle(new Date(startTime));
    const endDate = formatDateForGoogle(new Date(endTime));
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startDate}/${endDate}`,
      details: description,
      location: location,
      trp: 'false'
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.firstName || 
        !formData.lastName || !formData.email || !formData.phone || 
        !formData.serviceType) {
      alert('Please fill in all required fields');
      return;
    }

    if (isTimeSlotBooked(parseDateFromStorage(selectedDate), selectedTime)) {
      alert('This time slot has been booked by someone else. Please select another time.');
      setSelectedTime('');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // FIXED: Create appointment datetime in local timezone
      const appointmentDate = parseDateFromStorage(selectedDate);
      const timeComponents = convertTo24Hour(selectedTime);
      
      // Create start time in local timezone
      const startTime = new Date(appointmentDate);
      startTime.setHours(timeComponents.hours, timeComponents.minutes, 0, 0);
      
      // Create end time (1.5 hours later)
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 90); // 1.5 hours = 90 minutes
      
      // Prepare event data
      const eventData = {
        title: `${formData.serviceType} - ${formData.firstName} ${formData.lastName}`,
        description: `Tax consultation appointment\n\nClient Details:\n- Name: ${formData.firstName} ${formData.lastName}\n- Email: ${formData.email}\n- Phone: ${formData.phone}\n- Service: ${formData.serviceType}\n\n${formData.message ? `Additional Notes: ${formData.message}` : ''}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: 'Akbar Tax Store - Virtual Meeting',
        attendeeEmail: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        serviceType: formData.serviceType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Send timezone info
      };

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const updatedBookedSlots = { ...bookedSlots };
        if (!updatedBookedSlots[selectedDate]) {
          updatedBookedSlots[selectedDate] = [];
        }
        updatedBookedSlots[selectedDate].push(selectedTime);
        setBookedSlots(updatedBookedSlots);

        const googleCalendarURL = generateGoogleCalendarURL(
          startTime.toISOString(),
          endTime.toISOString(),
          eventData.title,
          eventData.description,
          eventData.location
        );
        
        setEventId(data.eventId || '');
        setMeetingLink(googleCalendarURL);
        setIsSubmitted(true);
      } else {
        alert(`Failed to schedule meeting: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = parseDateFromStorage(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateLong = (dateString) => {
    const date = parseDateFromStorage(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center bg-white rounded-2xl shadow-2xl p-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meeting Confirmed!</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {formatDateLong(selectedDate)} at {selectedTime}
            </p>
            <p className="text-gray-600 mb-2">
              Service: {formData.serviceType}
            </p>
            <p className="text-gray-600 mb-2">
              Client: {formData.firstName} {formData.lastName}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Duration: 1.5 hours
            </p>
            {eventId && (
              <p className="text-sm text-gray-500 mb-2">
                Event ID: {eventId}
              </p>
            )}
          </div>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly. Click the button below to add this appointment to your calendar.
          </p>
          <div className="space-y-3">
            {meetingLink && (
              <a
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-center"
              >
                📅 Add to Google Calendar
              </a>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Schedule Another Meeting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-br from-[#072971] via-[#0040A8] to-[#072971] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Akbar Tax Store</h1>
            <p className="text-xl text-blue-100 mb-6">Schedule Your Professional Tax Consultation</p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Licensed Tax Professionals</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>1.5 Hour Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h3>
              <div className="space-y-3">
                {serviceTypes.map((service, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.serviceType === service.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    } ${service.popular ? 'relative' : ''}`}
                    onClick={() => setFormData({...formData, serviceType: service.name})}
                  >
                    {service.popular && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                        <p className="text-blue-600 font-medium text-sm mt-1">{service.price}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        formData.serviceType === service.name
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.serviceType === service.name && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Book Your Appointment</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                  Select Date
                </h3>
                
                <div className="bg-gray-50 rounded-t-xl p-4 flex items-center justify-between">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <h4 className="text-lg font-semibold text-gray-900">
                    {currentMonth.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h4>
                  
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div key={index} className="p-3 text-center font-semibold text-gray-600 text-sm">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7">
                    {calendarDays.map((date, index) => {
                      const isAvailable = isDateAvailable(date);
                      const isCurrentMonthDate = isCurrentMonth(date);
                      const dateString = formatDateForStorage(date);
                      const isSelected = selectedDate === dateString;
                      const isToday = date.toDateString() === new Date().toDateString();
                      const hasBookedSlots = bookedSlots[dateString] && bookedSlots[dateString].length > 0;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedDate(dateString);
                              setSelectedTime('');
                            }
                          }}
                          disabled={!isAvailable}
                          className={`
                            relative p-3 h-12 text-center transition-all border-r border-b border-gray-100 last:border-r-0
                            ${isSelected 
                              ? 'bg-blue-500 text-white font-bold' 
                              : isAvailable 
                                ? 'hover:bg-blue-50 hover:text-blue-600 cursor-pointer' 
                                : 'cursor-not-allowed'
                            }
                            ${!isCurrentMonthDate 
                              ? 'text-gray-300' 
                              : isAvailable 
                                ? 'text-gray-900' 
                                : 'text-gray-400'
                            }
                            ${isToday && !isSelected ? 'bg-blue-100 font-semibold' : ''}
                          `}
                        >
                          <span className="text-sm">
                            {date.getDate()}
                          </span>
                          
                          {isToday && !isSelected && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                          )}
                          
                          {hasBookedSlots && isAvailable && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-600" />
                  Select Time (1.5 Hour Sessions)
                  {selectedDate && bookedSlots[selectedDate] && bookedSlots[selectedDate].length > 0 && (
                    <span className="ml-2 text-sm text-orange-600 font-normal">
                      ({bookedSlots[selectedDate].length} slots unavailable)
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((time, index) => {
                    const isBooked = selectedDate && isTimeSlotBooked(parseDateFromStorage(selectedDate), time);
                    const isDisabled = !selectedDate || isBooked;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isDisabled && setSelectedTime(time)}
                        disabled={isDisabled}
                        className={`p-3 rounded-xl border-2 transition-all font-semibold relative ${
                          isDisabled
                            ? isBooked 
                              ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed'
                              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : selectedTime === time
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                        {isBooked && (
                          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!selectedDate && (
                  <p className="text-sm text-gray-500 mt-2">Please select a date first to see available time slots.</p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  Your Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter your First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter Your Last Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="ats@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="03010000000"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell us about your specific needs or questions..."
                  />
                </div>
              </div>

              {(selectedDate || selectedTime || formData.serviceType) && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Appointment Summary</h4>
                  <div className="space-y-2 text-sm">
                    {formData.serviceType && (
                      <p><span className="font-medium">Service:</span> {formData.serviceType}</p>
                    )}
                    {selectedDate && (
                      <p><span className="font-medium">Date:</span> {formatDateLong(selectedDate)}</p>
                    )}
                    {selectedTime && (
                      <p><span className="font-medium">Time:</span> {selectedTime} (1.5 hours)</p>
                    )}
                    {formData.firstName && formData.lastName && (
                      <p><span className="font-medium">Client:</span> {formData.firstName} {formData.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg"
              >
                {isSubmitting ? 'Booking Your Appointment...' : 'Schedule My Appointment'}
              </button>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookMeetingPage;