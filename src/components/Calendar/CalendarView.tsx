import React, { useState, useCallback, useEffect } from 'react';
import type { CalendarEvent, CalendarViewProps } from '../../types/calendar.types';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventManager } from '../../hooks/useEventManager';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { Button } from '../primitives/Button';
import { formatDate } from '../../utils/date.utils';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialDate,
}) => {
  const calendar = useCalendar(initialDate);
  const eventManager = useEventManager(initialEvents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleDateClick = useCallback((date: Date) => {
    calendar.selectDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, [calendar]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleTimeSlotClick = useCallback((date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    calendar.selectDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, [calendar]);

  const handleEventSave = useCallback((eventData: Partial<CalendarEvent>) => {
    try {
      if (selectedEvent) {
        eventManager.updateEvent(selectedEvent.id, eventData);
        onEventUpdate(selectedEvent.id, eventData);
      } else {
        const newEvent = eventManager.addEvent(eventData as Omit<CalendarEvent, 'id'>);
        onEventAdd(newEvent);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }, [selectedEvent, eventManager, onEventUpdate, onEventAdd]);

  const handleEventDelete = useCallback((id: string) => {
    eventManager.deleteEvent(id);
    onEventDelete(id);
  }, [eventManager, onEventDelete]);

  const toggleView = useCallback(() => {
    calendar.setView(calendar.view === 'month' ? 'week' : 'month');
  }, [calendar]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !isModalOpen) {
        e.preventDefault();
        calendar.goToPreviousMonth();
      } else if (e.key === 'ArrowRight' && !isModalOpen) {
        e.preventDefault();
        calendar.goToNextMonth();
      } else if (e.key === 't' && !isModalOpen) {
        e.preventDefault();
        calendar.goToToday();
      } else if (e.key === 'v' && !isModalOpen) {
        e.preventDefault();
        toggleView();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [calendar, isModalOpen, toggleView]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-primary-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* App Header */}
        <div className="bg-white dark:bg-dark-primary-800 rounded-2xl shadow-modern-lg border border-neutral-200 dark:border-dark-primary-700 mb-8 overflow-hidden animate-fade-in">
          <div className="bg-neutral-900 dark:bg-dark-primary-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="typography-heading-2 text-white">Calendar</h1>
                <p className="typography-caption text-neutral-300 dark:text-dark-primary-200 mt-1">Manage your events and schedule</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={calendar.goToToday}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:shadow-modern"
                >
                  Today
                </Button>
                <div className="flex items-center bg-white/10 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    onClick={calendar.goToPreviousMonth}
                    className="text-white hover:bg-white/20 px-3 hover:shadow-modern"
                  >
                    ‹
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={calendar.goToNextMonth}
                    className="text-white hover:bg-white/20 px-3 hover:shadow-modern"
                  >
                    ›
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  onClick={toggleView}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:shadow-modern"
                >
                  {calendar.view === 'month' ? 'Week' : 'Month'}
                </Button>
              </div>
            </div>
          </div>

          {/* Month/Year Header */}
          <div className="px-8 py-6 bg-white dark:bg-dark-primary-800 border-b border-neutral-200 dark:border-dark-primary-700">
            <h2 className="typography-heading-3 text-neutral-900 dark:text-dark-primary-100 text-center">
              {formatDate(calendar.currentDate, 'MMMM yyyy')}
            </h2>
          </div>
        </div>

        {/* Calendar Content */}
        {calendar.view === 'month' ? (
          <MonthView
            currentDate={calendar.currentDate}
            events={eventManager.events}
            selectedDate={calendar.selectedDate}
            onDateSelect={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={calendar.currentDate}
            events={eventManager.events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-primary-800 rounded-xl shadow-modern border border-neutral-200 dark:border-dark-primary-700 p-6 hover:shadow-modern-lg transition-shadow duration-300 animate-slide-up">
            <div className="text-center">
              <p className="typography-label text-neutral-600 dark:text-dark-primary-400 mb-2">Total Events</p>
              <p className="typography-heading-3 text-neutral-900 dark:text-dark-primary-100">{eventManager.events.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-primary-800 rounded-xl shadow-modern border border-neutral-200 dark:border-dark-primary-700 p-6 hover:shadow-modern-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center">
              <p className="typography-label text-neutral-600 dark:text-dark-primary-400 mb-2">This Month</p>
              <p className="typography-heading-3 text-neutral-900 dark:text-dark-primary-100">
                {eventManager.events.filter(event =>
                  event.startDate.getMonth() === calendar.currentDate.getMonth() &&
                  event.startDate.getFullYear() === calendar.currentDate.getFullYear()
                ).length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-primary-800 rounded-xl shadow-modern border border-neutral-200 dark:border-dark-primary-700 p-6 hover:shadow-modern-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <p className="typography-label text-neutral-600 dark:text-dark-primary-400 mb-2">Upcoming</p>
              <p className="typography-heading-3 text-neutral-900 dark:text-dark-primary-100">
                {eventManager.events.filter(event => event.startDate > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        event={selectedEvent}
        selectedDate={calendar.selectedDate || undefined}
      />
    </div>
  );
};
