import React from 'react';
import type { CalendarEvent } from '../../types/calendar.types';
import { groupEventsByDate } from '../../utils/event.utils';
import { formatDate } from '../../utils/date.utils';
import { isToday, isTomorrow, isYesterday } from 'date-fns';

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export const ListView: React.FC<ListViewProps> = ({ events, onEventClick }) => {
  const groupedEvents = groupEventsByDate(events);

  const getDateLabel = (dateKey: string): string => {
    const date = new Date(dateKey);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return formatDate(date, 'EEEE, MMM d');
  };

  const sortedDateKeys = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (sortedDateKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="typography-heading-3 text-neutral-900 dark:text-dark-primary-100 mb-2">No events scheduled</h3>
        <p className="typography-body text-neutral-600 dark:text-dark-primary-400">Your upcoming events will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDateKeys.map(dateKey => {
        const dateEvents = groupedEvents[dateKey];
        const date = new Date(dateKey);

        return (
          <div key={dateKey} className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="typography-heading-4 text-neutral-900 dark:text-dark-primary-100">
                {getDateLabel(dateKey)}
              </h3>
              <span className="text-sm text-neutral-500 dark:text-dark-primary-400">
                {formatDate(date, 'MMM d, yyyy')}
              </span>
            </div>

            <div className="space-y-2">
              {dateEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="bg-white dark:bg-dark-primary-800 rounded-xl shadow-modern border border-neutral-200 dark:border-dark-primary-700 p-4 hover:shadow-modern-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className="w-3 h-3 rounded-full mt-2"
                        style={{ backgroundColor: event.color || '#3b82f6' }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="typography-heading-5 text-neutral-900 dark:text-dark-primary-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {event.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="typography-caption text-neutral-600 dark:text-dark-primary-400">
                          {formatDate(event.start, 'h:mm a')} - {formatDate(event.end, 'h:mm a')}
                        </span>
                      </div>

                      {event.description && (
                        <p className="typography-body text-neutral-600 dark:text-dark-primary-400 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
