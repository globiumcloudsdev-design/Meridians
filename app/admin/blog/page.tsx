'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { BlogTable } from '@/components/admin/BlogTable';
import { BlogPostDialog } from '@/components/admin/BlogPostDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { BlogPost } from '@/lib/types';
import { API_BLOG, API_BLOG_BY_SLUG } from '@/lib/api/endpoints';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_BLOG);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error loading blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditPost(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditPost(post);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditPost(null);
  };

  const handleDialogSubmit = async (data: Partial<BlogPost>) => {
    try {
      const method = editPost ? 'PUT' : 'POST';
      const url = editPost ? API_BLOG_BY_SLUG(editPost.slug) : API_BLOG;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success(editPost ? 'Blog post updated' : 'Blog post added');
        fetchPosts();
        handleDialogClose();
      } else {
        toast.error('Error saving post');
      }
    } catch (error) {
      toast.error('Error saving post');
    }
  };

  const handleDelete = (post: BlogPost) => {
    setDeletePost(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePost) return;
    try {
      const response = await fetch(API_BLOG_BY_SLUG(deletePost.slug), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Blog post deleted');
        setPosts(posts.filter((p) => p.slug !== deletePost.slug));
        setDeleteDialogOpen(false);
        setDeletePost(null);
      } else {
        toast.error('Error deleting post');
      }
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeletePost(null);
  };

  const handleView = (post: BlogPost) => {
    window.open(`/blog/${post.slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Manage all blog posts and articles</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No blog posts yet. Create your first post!</p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleAdd}>
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BlogTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <BlogPostDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editPost || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deletePost?.title}
      />
    </div>
  );
}
