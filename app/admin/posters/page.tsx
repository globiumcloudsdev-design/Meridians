'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PosterDialog } from '@/components/admin/PosterDialog';
import { PosterTable } from '@/components/admin/PosterTable';
import { API_POSTERS, API_POSTERS_BY_ID } from '@/lib/api/endpoints';
import { IPoster } from '@/lib/types';

export default function AdminPostersPage() {
  const [posters, setPosters] = useState<IPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPoster, setEditPoster] = useState<IPoster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePoster, setDeletePoster] = useState<IPoster | null>(null);

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const response = await fetch(API_POSTERS);
      if (!response.ok) {
        throw new Error('Failed to fetch posters');
      }

      const data = await response.json();
      setPosters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posters:', error);
      toast.error('Error loading posters');
      setPosters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditPoster(null);
    setDialogOpen(true);
  };

  const handleEdit = (poster: IPoster) => {
    setEditPoster(poster);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditPoster(null);
  };

  const handleDialogSubmit = async (data: Partial<IPoster>) => {
    try {
      const method = editPoster ? 'PUT' : 'POST';
      const url = editPoster ? API_POSTERS_BY_ID(editPoster._id) : API_POSTERS;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save poster');
      }

      toast.success(editPoster ? 'Poster updated' : 'Poster created');
      await fetchPosters();
      handleDialogClose();
    } catch (error) {
      console.error('Error saving poster:', error);
      toast.error('Error saving poster');
    }
  };

  const handleDelete = (poster: IPoster) => {
    setDeletePoster(poster);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePoster) return;

    try {
      const response = await fetch(API_POSTERS_BY_ID(deletePoster._id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete poster');
      }

      setPosters((prev) => prev.filter((item) => item._id !== deletePoster._id));
      toast.success('Poster deleted');
      setDeleteDialogOpen(false);
      setDeletePoster(null);
    } catch (error) {
      console.error('Error deleting poster:', error);
      toast.error('Error deleting poster');
    }
  };

  const handleToggleActive = async (poster: IPoster, nextActive: boolean) => {
    try {
      const response = await fetch(API_POSTERS_BY_ID(poster._id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update active status');
      }

      toast.success(nextActive ? 'Poster activated' : 'Poster deactivated');
      await fetchPosters();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Error updating active status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posters</h1>
          <p className="text-muted-foreground mt-2">Manage homepage promotional posters</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Poster
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading posters...</p>
          </CardContent>
        </Card>
      ) : posters.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No posters found. Create your first poster.</p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleAdd}>
              Create First Poster
            </Button>
          </CardContent>
        </Card>
      ) : (
        <PosterTable
          posters={posters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}

      <PosterDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editPoster || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletePoster(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletePoster?.title || 'this poster'}
      />
    </div>
  );
}
