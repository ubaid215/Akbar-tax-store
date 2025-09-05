// app/history/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, ArrowLeft, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const HistoryPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/calendar/events?range=${filter}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        // Sort events by date
        const sortedEvents = data.events.sort((a, b) => {
          return new Date(a.startTime) - new Date(b.startTime);
        });
        
        setEvents(sortedEvents);
      } else {
        throw new Error(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getEventStatus = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return start > now ? 'Upcoming' : 'Completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Meetings</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchEvents}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="block w-full bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-semibold text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="mr-4 p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Meeting History</h1>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-xl shadow-sm p-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All Meetings</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filter === 'upcoming' 
              ? 'Showing upcoming meetings' 
              : filter === 'past' 
                ? 'Showing past meetings' 
                : 'Showing all meetings'}
          </p>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {events.length} {events.length === 1 ? 'meeting' : 'meetings'}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No meetings found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'upcoming' 
                ? "You don't have any upcoming meetings scheduled." 
                : filter === 'past'
                  ? "You don't have any past meetings yet."
                  : "You don't have any meetings scheduled."}
            </p>
            <Link 
              href="/book-meeting"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Schedule a Meeting
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => {
              const status = getEventStatus(event.startTime);
              const isUpcoming = status === 'Upcoming';
              
              return (
                <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`p-6 ${isUpcoming ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-300'}`}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.startTime)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                        
                        {event.description && (
                          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                            {event.description.split('\n')[0]}
                          </p>
                        )}
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isUpcoming 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </div>
                      </div>
                      
                      {isUpcoming && event.hangoutLink && (
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <a
                            href={event.hangoutLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;