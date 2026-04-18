'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { VideosTable } from '@/components/admin/VideosTable';
import { VideoUploadDialog } from '@/components/admin/VideoUploadDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { VideoResponse, VideoFormData } from '@/lib/types/uploadVideo';
import { API_VIDEOS, API_VIDEO_BY_ID } from '@/lib/api/endpoints';

export default function AdminUploadVideo() {
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<VideoResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState<VideoResponse | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(API_VIDEOS);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Error loading videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditVideo(null);
    setDialogOpen(true);
  };

  const handleEdit = (video: VideoResponse) => {
    setEditVideo(video);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditVideo(null);
  };

  const handleDialogSubmit = async (data: Partial<VideoFormData>) => {
    try {
      const method = editVideo ? 'PUT' : 'POST';
      const url = editVideo ? API_VIDEO_BY_ID(editVideo._id) : API_VIDEOS;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast.success(editVideo ? 'Video updated successfully' : 'Video added successfully');
        fetchVideos();
        handleDialogClose();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error saving video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Error saving video');
    }
  };

  const handleDelete = (video: VideoResponse) => {
    setDeleteVideo(video);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteVideo) return;
    try {
      const response = await fetch(API_VIDEO_BY_ID(deleteVideo._id), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Video deleted successfully');
        setVideos(videos.filter((v) => v._id !== deleteVideo._id));
        setDeleteDialogOpen(false);
        setDeleteVideo(null);
      } else {
        toast.error('Error deleting video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Error deleting video');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteVideo(null);
  };

  const handleView = (video: VideoResponse) => {
    window.open(`/video/${video._id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
          <p className="text-muted-foreground mt-2">Manage all videos and content</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Video
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading videos...</p>
          </CardContent>
        </Card>
      ) : videos.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No videos yet. Create your first video!</p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleAdd}>
              Create First Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <VideosTable
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <VideoUploadDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editVideo || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteVideo?.title}
      />
    </div>
  );
}