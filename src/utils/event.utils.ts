import type { CalendarEvent } from '../types/calendar.types';
import { isSameDayUtil } from './date.utils';

/**
 * Filters events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDayUtil(event.startDate, date));
};

/**
 * Sorts events by start time
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

/**
 * Checks if an event overlaps with others on the same day
 */
export const hasOverlappingEvents = (event: CalendarEvent, allEvents: CalendarEvent[]): boolean => {
  const sameDayEvents = getEventsForDate(allEvents, event.startDate);
  return sameDayEvents.some(otherEvent => {
    if (otherEvent.id === event.id) return false;
    return (
      (event.startDate >= otherEvent.startDate && event.startDate < otherEvent.endDate) ||
      (event.endDate > otherEvent.startDate && event.endDate <= otherEvent.endDate) ||
      (event.startDate <= otherEvent.startDate && event.endDate >= otherEvent.endDate)
    );
  });
};

/**
 * Generates a unique ID for a new event
 */
export const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates event data
 */
export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];

  if (!event.title?.trim()) {
    errors.push('Title is required');
  }

  if (!event.startDate) {
    errors.push('Start date is required');
  }

  if (!event.endDate) {
    errors.push('End date is required');
  }

  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('End date must be after start date');
  }

  return errors;
};
