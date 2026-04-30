'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, School, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClassTable } from '@/components/admin/ClassTable';
import { ClassDialog } from '@/components/admin/ClassDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { ClassItem } from '@/lib/types';
import { API_CLASSES, API_CLASS_BY_ID } from '@/lib/api/endpoints';

export default function AdminClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ClassItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ClassItem | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_CLASSES);
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        setFilteredClasses(data);
      } else {
        toast.error('Failed to load classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Error loading classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(
        (classItem) =>
          classItem.name.toLowerCase().includes(query.toLowerCase()) ||
          classItem.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (classItem: ClassItem) => {
    setEditItem(classItem);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleDialogSubmit = async (data: Partial<ClassItem>) => {
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? API_CLASS_BY_ID(editItem._id) : API_CLASSES;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editItem ? 'Class updated successfully' : 'Class added successfully');
        fetchClasses();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error saving class');
      }
    } catch (error) {
      toast.error('Error saving class');
    }
  };

  const handleDelete = (classItem: ClassItem) => {
    setDeleteItem(classItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const response = await fetch(API_CLASS_BY_ID(deleteItem._id), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Class deleted successfully');
        setClasses(classes.filter((c) => c._id !== deleteItem._id));
        setDeleteDialogOpen(false);
        setDeleteItem(null);
      } else {
        toast.error('Error deleting class');
      }
    } catch (error) {
      toast.error('Error deleting class');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Classes Section</h1>
          </div>
          <p className="text-slate-500 mt-2 font-medium">Manage class offerings, fees, and availability</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Class
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading classes...</p>
          </CardContent>
        </Card>
      ) : classes.length === 0 ? (
        <Card className="border-dashed border-2 border-emerald-100 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <School className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No classes found</p>
            <p className="text-slate-500 mb-6 text-center max-w-md">Start by adding your first class with fees and description.</p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
              onClick={handleAdd}
            >
              Add First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden">
          <ClassTable
            classes={classes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Dialogs */}
      <ClassDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editItem || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.name}
      />
    </div>
  );
}
