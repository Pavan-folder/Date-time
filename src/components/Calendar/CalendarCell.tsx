import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import type { CalendarCellProps, CalendarEvent } from '../../types/calendar.types';
import { formatDate } from '../../utils/date.utils';
import { getEventsForDate, sortEventsByTime } from '../../utils/event.utils';

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  events,
  isToday,
  isSelected,
  isCurrentMonth = true,
  onClick,
  onEventClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(date);
  }, [date, onClick]);

  const handleEventClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  const dayEvents = getEventsForDate(events, date);
  const sortedEvents = sortEventsByTime(dayEvents);
  const displayedEvents = sortedEvents.slice(0, 3);
  const remainingCount = sortedEvents.length - 3;

  return (
    <div
      className={clsx(
        'border rounded-lg p-2 h-24 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        !isCurrentMonth && 'text-gray-400 bg-gray-50',
        isToday && 'bg-blue-500 text-white'
      )}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`${formatDate(date, 'MMMM d, yyyy')}. ${dayEvents.length} events.`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex justify-between items-center">
        <span className={clsx(
          'text-sm font-semibold',
          isToday ? 'text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
        )}>
          {date.getDate()}
        </span>
        <button
          className={clsx(
            'text-xs hover:bg-gray-200 rounded p-1 transition-colors',
            isToday ? 'text-white hover:bg-white hover:text-blue-500' : 'text-blue-500'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label="Add event"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-1 overflow-hidden">
        {displayedEvents.length > 0 ? (
          displayedEvents.map(event => (
            <div
              key={event.id}
              onClick={(e) => handleEventClick(event, e)}
              className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-all duration-200 text-white"
              style={{ backgroundColor: event.color || '#3b82f6' }}
              title={`${event.title} - ${formatDate(event.start, 'HH:mm')} to ${formatDate(event.end, 'HH:mm')}`}
              tabIndex={0}
              role="button"
              aria-label={`Event: ${event.title}`}
            >
              {event.title}
            </div>
          ))
        ) : (
          <div className={clsx(
            'text-xs',
            isToday ? 'text-blue-100' : 'text-gray-500'
          )}>
            No events
          </div>
        )}
        {remainingCount > 0 && (
          <button
            className={clsx(
              'text-xs hover:underline focus:outline-none focus:ring-1',
              isToday ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:text-blue-800'
            )}
            onClick={(e) => {
              e.stopPropagation();
              // Could open a modal with all events
            }}
            aria-label={`${remainingCount} more events`}
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
});
