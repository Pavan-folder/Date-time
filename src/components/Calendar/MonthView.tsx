import React, { useCallback } from 'react';
import type { CalendarEvent } from '../../types/calendar.types';
import { getCalendarGrid, getWeekDays } from '../../utils/date.utils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = React.memo(({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
}) => {
  const calendarDays = getCalendarGrid(currentDate);
  const weekDays = getWeekDays();

  const handleDateClick = useCallback((date: Date) => {
    onDateSelect(date);
  }, [onDateSelect]);

  const handleEventClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Modern Calendar Grid */}
      <div className="bg-white dark:bg-dark-primary-800 rounded-3xl shadow-modern-xl overflow-hidden border border-neutral-200 dark:border-dark-primary-700 animate-fade-in">
        {/* Month Header */}
        <div className="bg-neutral-900 dark:bg-dark-primary-700 px-8 py-6">
          <h2 className="typography-heading-1 text-white text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-neutral-50 dark:bg-dark-primary-800 border-b border-neutral-200 dark:border-dark-primary-700">
          {weekDays.map(day => (
            <div key={day} className="py-4 px-2 text-center">
              <span className="typography-caption text-neutral-600 dark:text-dark-primary-400 uppercase tracking-wider">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate ? selectedDate.toDateString() === date.toDateString() : false;
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            // Get events for this date
            const dayEvents = events.filter(event =>
              event.startDate.toDateString() === date.toDateString()
            );

            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-3 border-r border-b border-neutral-100 dark:border-dark-primary-700 cursor-pointer
                  transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-dark-primary-700 hover:shadow-modern
                  ${isToday ? 'bg-primary-50 dark:bg-dark-primary-700 border-primary-200' : ''}
                  ${isSelected ? 'bg-primary-100 dark:bg-dark-primary-600 ring-2 ring-primary-400 ring-inset' : ''}
                  ${!isCurrentMonth ? 'bg-neutral-25 dark:bg-dark-primary-900 text-neutral-400 dark:text-dark-primary-500' : 'text-neutral-900 dark:text-dark-primary-100'}
                  last:border-r-0
                `}
                onClick={() => handleDateClick(date)}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`
                      text-lg font-semibold
                      ${isToday ? 'bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm' : ''}
                      ${!isCurrentMonth ? 'text-neutral-400 dark:text-dark-primary-500' : 'text-neutral-900 dark:text-dark-primary-100'}
                    `}
                  >
                    {date.getDate()}
                  </span>

                  {/* Event Indicator */}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-1">
                  {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="typography-caption text-neutral-500 dark:text-dark-primary-400 font-medium">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Events List */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="typography-caption p-1.5 rounded-md truncate font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: event.color + '20',
                        borderLeft: `3px solid ${event.color}`
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
