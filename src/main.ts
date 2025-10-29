import React from 'react';
import ReactDOM from 'react-dom/client';
import { CalendarView } from './components/Calendar/CalendarView';
import type { CalendarEvent } from './types/calendar.types';
import './styles/globals.css';

// Sample events for demo
const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 9, 30),
    color: '#3b82f6',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 15, 15, 30),
    color: '#10b981',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    start: new Date(2024, 0, 16, 10, 0),
    end: new Date(2024, 0, 16, 11, 30),
    color: '#f59e0b',
  },
];

const App: React.FC = () => {
  const handleEventAdd = (event: CalendarEvent) => {
    console.log('Event added:', event);
  };

  const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    console.log('Event updated:', id, updates);
  };

  const handleEventDelete = (id: string) => {
    console.log('Event deleted:', id);
  };

  return React.createElement(CalendarView, {
    events: sampleEvents,
    onEventAdd: handleEventAdd,
    onEventUpdate: handleEventUpdate,
    onEventDelete: handleEventDelete,
    initialView: 'month',
    initialDate: new Date(),
  });
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
);
