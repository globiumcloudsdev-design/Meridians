'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { NoteTable } from '@/components/admin/NoteTable';
import { NoteDialog } from '@/components/admin/NoteDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { NoteItem } from '@/lib/types';
import { API_NOTES, API_NOTE_BY_ID } from '@/lib/api/endpoints';

export default function AdminNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<NoteItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteNote, setDeleteNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_NOTES);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        toast.error('Failed to load notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error loading notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note: NoteItem) => {
    setEditNote(note);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditNote(null);
  };

  const handleDialogSubmit = async (data: FormData) => {
    try {
      const method = editNote ? 'PUT' : 'POST';
      const url = editNote ? API_NOTE_BY_ID(editNote._id) : API_NOTES;

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        toast.success(editNote ? 'Note updated successfully' : 'Note added successfully');
        fetchNotes();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error saving note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error saving note');
    }
  };

  const handleDelete = (note: NoteItem) => {
    setDeleteNote(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNote) return;
    try {
      const response = await fetch(API_NOTE_BY_ID(deleteNote._id), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Note deleted successfully');
        setNotes(notes.filter((n) => n._id !== deleteNote._id));
        setDeleteDialogOpen(false);
        setDeleteNote(null);
      } else {
        toast.error('Error deleting note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error deleting note');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteNote(null);
  };

  const handleView = (note: NoteItem) => {
    window.open(note.pdfUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notes Section</h1>
          </div>
          <p className="text-slate-500 mt-2 font-medium">Manage educational notes and PDF resources</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Note
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading notes...</p>
          </CardContent>
        </Card>
      ) : notes.length === 0 ? (
        <Card className="border-dashed border-2 border-emerald-100 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No notes found</p>
            <p className="text-slate-500 mb-6 text-center max-w-md">Start by adding your first educational note or resource.</p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
              onClick={handleAdd}
            >
              Create First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden">
          <NoteTable
            notes={notes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      <NoteDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editNote || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteNote?.subject}
      />
    </div>
  );
}
