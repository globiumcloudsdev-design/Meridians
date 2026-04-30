'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LibraryTable } from '@/components/admin/LibraryTable';
import { LibraryDialog } from '@/components/admin/LibraryDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { LibraryItem } from '@/lib/types';
import { API_LIBRARY, API_LIBRARY_BY_ID } from '@/lib/api/endpoints';

export default function AdminLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<LibraryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_LIBRARY);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        toast.error('Failed to load library items');
      }
    } catch (error) {
      console.error('Error fetching library:', error);
      toast.error('Error loading library items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: LibraryItem) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleDialogSubmit = async (data: any) => {
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? API_LIBRARY_BY_ID(editItem._id) : API_LIBRARY;

      const response = await fetch(url, {
        method,
        body: data, // FormData directly
      });

      if (response.ok) {
        toast.success(editItem ? 'Library item updated' : 'Library item added');
        fetchItems();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error saving item');
      }
    } catch (error) {
      toast.error('Error saving library item');
    }
  };

  const handleDelete = (item: LibraryItem) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const response = await fetch(API_LIBRARY_BY_ID(deleteItem._id), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Item deleted successfully');
        setItems(items.filter((i) => i._id !== deleteItem._id));
        setDeleteDialogOpen(false);
        setDeleteItem(null);
      } else {
        toast.error('Error deleting item');
      }
    } catch (error) {
      toast.error('Error deleting library item');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const handleView = (item: LibraryItem) => {
    window.open(item.pdfUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Library Section</h1>
          </div>
          <p className="text-slate-500 mt-2 font-medium">Manage books, research papers, and PDF documents</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading library items...</p>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-2 border-emerald-100 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-semibold text-lg mb-1">Your library is empty</p>
            <p className="text-slate-500 mb-6 text-center max-w-md">Start by adding your first PDF document or book to the collection.</p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
              onClick={handleAdd}
            >
              Create First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className=" overflow-hidden">
          <LibraryTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      <LibraryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editItem || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.title}
      />
    </div>
  );
}
