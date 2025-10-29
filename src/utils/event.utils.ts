import type { CalendarEvent } from '../types/calendar.types';
import { isSameDayUtil } from './date.utils';

/**
 * Filters events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDayUtil(event.start, date));
};

/**
 * Sorts events by start time
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
};

/**
 * Checks if an event overlaps with others on the same day
 */
export const hasOverlappingEvents = (event: CalendarEvent, allEvents: CalendarEvent[]): boolean => {
  const sameDayEvents = getEventsForDate(allEvents, event.start);
  return sameDayEvents.some(otherEvent => {
    if (otherEvent.id === event.id) return false;
    return (
      (event.start >= otherEvent.start && event.start < otherEvent.end) ||
      (event.end > otherEvent.start && event.end <= otherEvent.end) ||
      (event.start <= otherEvent.start && event.end >= otherEvent.end)
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
 * Groups events by date for list view
 */
export const groupEventsByDate = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const grouped: Record<string, CalendarEvent[]> = {};

  events.forEach(event => {
    const dateKey = event.start.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  // Sort events within each date by start time
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey] = sortEventsByTime(grouped[dateKey]);
  });

  return grouped;
};

/**
 * Validates event data
 */
export const validateEvent = (event: any): string[] => {
  const errors: string[] = [];

  if (!event.title?.trim()) {
    errors.push('Title is required');
  }

  if (!event.start) {
    errors.push('Start date is required');
  }

  if (!event.end) {
    errors.push('End date is required');
  }

  if (event.start && event.end && event.start >= event.end) {
    errors.push('End date must be after start date');
  }

  return errors;
};
