import React from 'react';
import type { CalendarEvent } from '../../types/calendar.types';
import { getWeekDays, getTimeSlots, formatDate } from '../../utils/date.utils';
import { getEventsForDate } from '../../utils/event.utils';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  useSortable,
} from '@dnd-kit/sortable';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, time: string) => void;
  onEventUpdate?: (eventId: string, updatedEvent: Partial<CalendarEvent>) => void;
}

interface DraggableEventProps {
  event: CalendarEvent;
  onEventClick: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onEventClick, style }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({ id: event.id });

  const combinedStyle = { ...style };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      {...attributes}
      {...listeners}
      className="absolute left-1 right-1 rounded-md typography-caption p-1 cursor-grab active:cursor-grabbing hover:opacity-80 transition-all duration-300 overflow-hidden shadow-modern hover:shadow-modern-lg"
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
      title={`${event.title} - ${formatDate(event.startDate, 'HH:mm')} to ${formatDate(event.endDate, 'HH:mm')}`}
    >
      <div className="font-medium truncate">{event.title}</div>
    </div>
  );
};

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventUpdate,
}) => {
  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  // Get the start of the week (Sunday)
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (_event: DragStartEvent) => {
    // Handle drag start if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const draggedEventId = active.id as string;
    const targetSlot = over.id as string;

    // Parse target slot (format: "date-time")
    const [dateStr, timeStr] = targetSlot.split('-');
    const targetDate = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Update event time
    targetDate.setHours(hours, minutes, 0, 0);

    if (onEventUpdate) {
      const draggedEvent = events.find(e => e.id === draggedEventId);
      if (draggedEvent) {
        const duration = draggedEvent.endDate.getTime() - draggedEvent.startDate.getTime();
        const newEndDate = new Date(targetDate.getTime() + duration);

        onEventUpdate(draggedEventId, {
          startDate: targetDate,
          endDate: newEndDate,
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white dark:bg-dark-primary-800 rounded-2xl shadow-modern-lg border border-neutral-200 dark:border-dark-primary-700 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-neutral-200 dark:border-dark-primary-700">
        <div className="p-4 typography-caption text-neutral-700 dark:text-dark-primary-300 border-r border-neutral-200 dark:border-dark-primary-700">
          Time
        </div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className="p-4 text-center typography-caption text-neutral-700 dark:text-dark-primary-300 border-r border-neutral-200 dark:border-dark-primary-700 last:border-r-0"
          >
            <div>{weekDays[index]}</div>
            <div className="typography-caption text-neutral-500 dark:text-dark-primary-400">{formatDate(date, 'MMM d')}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-neutral-100 dark:border-dark-primary-700 last:border-b-0">
            {/* Time label */}
            <div className="p-2 typography-caption text-neutral-500 dark:text-dark-primary-400 text-right pr-4 border-r border-neutral-200 dark:border-dark-primary-700">
              {time}
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(events, date);
              const timeEvents = dayEvents.filter(event => {
                const eventHour = event.startDate.getHours();
                const eventMinute = event.startDate.getMinutes();
                const slotHour = parseInt(time.split(':')[0]);
                const slotMinute = parseInt(time.split(':')[1]);
                return eventHour === slotHour && Math.floor(eventMinute / 30) === Math.floor(slotMinute / 30);
              });

              return (
                <div
                  key={dayIndex}
                  className="relative h-12 border-r border-neutral-200 dark:border-dark-primary-700 last:border-r-0 hover:bg-neutral-50 dark:hover:bg-dark-primary-700 cursor-pointer transition-all duration-300 hover:shadow-modern"
                  onClick={() => onTimeSlotClick(date, time)}
                >
                  {timeEvents.map(event => {
                    const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 30); // 30-minute slots
                    const height = Math.max(duration * 48, 24); // Minimum 24px height

                    return (
                      <DraggableEvent
                        key={event.id}
                        event={event}
                        onEventClick={onEventClick}
                        style={{
                          backgroundColor: event.color || '#64748b',
                          height: `${height}px`,
                          top: '2px',
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  </DndContext>
  );
};
