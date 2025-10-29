import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import type { CalendarEvent } from '../../types/calendar.types';

// Sample events data
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
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 17, 17, 0),
    color: '#8b5cf6',
  },
];

// Generate many events for stress testing
const generateManyEvents = (count: number): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  for (let i = 0; i < count; i++) {
    const day = Math.floor(Math.random() * 30) + 1;
    const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const duration = Math.floor(Math.random() * 3) + 1; // 1-3 hours

    events.push({
      id: `evt-${i + 1}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      start: new Date(2024, 0, day, hour, 0),
      end: new Date(2024, 0, day, hour + duration, 0),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return events;
};

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialView: {
      control: { type: 'select' },
      options: ['month', 'week'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

export const Default: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Event added:', event),
    onEventUpdate: (id, updates) => console.log('Event updated:', id, updates),
    onEventDelete: (id) => console.log('Event deleted:', id),
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
};

export const Empty: Story = {
  args: {
    events: [],
    onEventAdd: (event) => console.log('Event added:', event),
    onEventUpdate: (id, updates) => console.log('Event updated:', id, updates),
    onEventDelete: (id) => console.log('Event deleted:', id),
    initialView: 'month',
    initialDate: new Date(),
  },
};

export const WeekView: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Event added:', event),
    onEventUpdate: (id, updates) => console.log('Event updated:', id, updates),
    onEventDelete: (id) => console.log('Event deleted:', id),
    initialView: 'week',
    initialDate: new Date(2024, 0, 15),
  },
};

export const WithManyEvents: Story = {
  args: {
    events: generateManyEvents(25),
    onEventAdd: (event) => console.log('Event added:', event),
    onEventUpdate: (id, updates) => console.log('Event updated:', id, updates),
    onEventDelete: (id) => console.log('Event deleted:', id),
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
};

export const InteractiveDemo: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: (event) => console.log('Event added:', event),
    onEventUpdate: (id, updates) => console.log('Event updated:', id, updates),
    onEventDelete: (id) => console.log('Event deleted:', id),
    initialView: 'month',
    initialDate: new Date(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with full event management capabilities. Click on dates to create events, click on events to edit them.',
      },
    },
  },
};
