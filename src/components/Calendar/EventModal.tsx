import React, { useState, useEffect } from 'react';
import type { CalendarEvent, EventFormData, FormErrors } from '../../types/calendar.types';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { Select } from '../primitives/Select';
import { validateEvent } from '../../utils/event.utils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
}

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Yellow' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#06b6d4', label: 'Cyan' },
];

const categoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start: selectedDate || new Date(),
    end: selectedDate ? new Date(selectedDate.getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000),
    color: '#3b82f6',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start: new Date(event.start),
        end: new Date(event.end),
        color: event.color || '#3b82f6',
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        start: new Date(selectedDate),
        end: new Date(selectedDate.getTime() + 60 * 60 * 1000),
      }));
    }
  }, [event, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateEvent(formData);
    if (validationErrors.length > 0) {
      const errorObj: FormErrors = {};
      validationErrors.forEach(error => {
        if (error.includes('Title')) errorObj.title = error;
        if (error.includes('Start date')) errorObj.start = error;
        if (error.includes('End date')) errorObj.end = error;
      });
      setErrors(errorObj);
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block typography-label text-neutral-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block typography-label text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event description"
          />
        </div>

        {/* Start Date/Time */}
        <div>
          <label htmlFor="startDate" className="block typography-label text-neutral-700 mb-1">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={formData.start.toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ ...prev, start: new Date(e.target.value) }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start}</p>}
        </div>

        {/* End Date/Time */}
        <div>
          <label htmlFor="endDate" className="block typography-label text-neutral-700 mb-1">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={formData.end.toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ ...prev, end: new Date(e.target.value) }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.end && <p className="mt-1 text-sm text-red-600">{errors.end}</p>}
        </div>

        {/* Color */}
        <div>
          <label className="block typography-label text-neutral-700 mb-1">
            Color
          </label>
          <Select
            options={colorOptions}
            value={formData.color}
            onChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
            placeholder="Select color"
          />
        </div>



        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div>
            {event && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {event ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
