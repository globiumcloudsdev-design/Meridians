'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { TimelineDialog } from '@/components/admin/TimelineDialog';
import { TimelineTable } from '@/components/admin/TimelineTable';
import { API_TIMELINE, API_TIMELINE_BY_ID } from '@/lib/api/endpoints';
import { TimelineEvent } from '@/lib/types';

export default function AdminTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<TimelineEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_TIMELINE);
      if (!response.ok) {
        throw new Error('Failed to load timeline events');
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast.error('Error loading timeline events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditEvent(null);
    setDialogOpen(true);
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditEvent(event);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditEvent(null);
  };

  const handleDialogSubmit = async (data: Partial<TimelineEvent>) => {
    try {
      const method = editEvent ? 'PUT' : 'POST';
      const url = editEvent ? API_TIMELINE_BY_ID(editEvent._id) : API_TIMELINE;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save timeline event');
      }

      toast.success(editEvent ? 'Timeline event updated' : 'Timeline event added');
      fetchEvents();
      handleDialogClose();
    } catch (error) {
      console.error('Error saving timeline event:', error);
      toast.error('Error saving timeline event');
    }
  };

  const handleDelete = (event: TimelineEvent) => {
    setDeleteEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEvent) return;

    try {
      const response = await fetch(API_TIMELINE_BY_ID(deleteEvent._id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete timeline event');
      }

      toast.success('Timeline event deleted');
      setEvents((prev) => prev.filter((event) => event._id !== deleteEvent._id));
      setDeleteDialogOpen(false);
      setDeleteEvent(null);
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      toast.error('Error deleting timeline event');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admissions Timeline</h1>
          <p className="text-muted-foreground mt-2">Manage timeline milestones shown on the admissions page</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading timeline events...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No timeline events found. Add your first milestone.</p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleAdd}>
              Create First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TimelineTable events={events} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <TimelineDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editEvent || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteEvent?.title}
      />
    </div>
  );
}
