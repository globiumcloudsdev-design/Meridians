'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { TimelineEvent } from '@/lib/types';

interface TimelineDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TimelineEvent>) => void;
  initialData?: TimelineEvent;
}

const DEFAULT_FORM: Partial<TimelineEvent> = {
  title: '',
  date: '',
  description: '',
  icon: 'Calendar',
  order: 1,
};

interface DatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

function DatePicker({ date: dateString, onChange }: DatePickerProps) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (dateString) {
      try {
        const parsed = parse(dateString, 'd MMM yyyy', new Date());
        setDate(parsed);
      } catch {
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  }, [dateString]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full font-normal justify-start text-left h-10 ${!date ? "text-muted-foreground" : ""}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "d MMM yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            onChange(selectedDate ? format(selectedDate, "d MMM yyyy") : "");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimelineDialog({ open, onClose, onSubmit, initialData }: TimelineDialogProps) {
  const [formData, setFormData] = useState<Partial<TimelineEvent>>(DEFAULT_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        date: initialData.date,
        description: initialData.description,
        icon: initialData.icon,
        order: initialData.order,
      });
      return;
    }

    setFormData(DEFAULT_FORM);
  }, [initialData, open]);

  const handleChange = (field: keyof TimelineEvent, value: string | number | Date) => {
    let finalValue = value;
    if (field === 'date' && value instanceof Date) {
      finalValue = format(value, "d MMM yyyy");
    }
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-lg leading-none font-semibold">
            {initialData ? 'Edit Timeline Event' : 'Create Timeline Event'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {initialData
              ? 'Update the event details below.'
              : 'Add a new milestone to the admissions timeline.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Portal Opens"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker 
              date={formData.date || ''}
              onChange={(dateStr) => handleChange('date', dateStr)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name (lucide-react)</Label>
            <Input
              id="icon"
              value={formData.icon || ''}
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="Globe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              min={1}
              value={formData.order ?? 1}
              onChange={(e) => handleChange('order', Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Digital registration goes live."
              rows={3}
              required
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              {initialData ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
