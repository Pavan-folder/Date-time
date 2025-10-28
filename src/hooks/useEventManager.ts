import { useState, useCallback } from 'react';
import type { CalendarEvent } from '../types/calendar.types';
import { generateEventId, validateEvent } from '../utils/event.utils';

export const useEventManager = (initialEvents: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const errors = validateEvent(eventData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const newEvent: CalendarEvent = {
      ...eventData,
      id: generateEventId(),
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    const eventToUpdate = events.find(event => event.id === id);
    if (!eventToUpdate) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = { ...eventToUpdate, ...updates };
    const errors = validateEvent(updatedEvent);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    setEvents(prev => prev.map(event =>
      event.id === id ? updatedEvent : event
    ));
    return updatedEvent;
  }, [events]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  };
};
