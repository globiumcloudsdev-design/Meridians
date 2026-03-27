'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_UPLOAD } from '@/lib/api/endpoints';
import { toast } from 'sonner';

interface BlogPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BlogPost>) => void;
  initialData?: BlogPost;
}

const CATEGORIES = ['General', 'Announcement', 'Success Story', 'News', 'Event', 'Academic'];

export function BlogPostDialog({ open, onClose, onSubmit, initialData }: BlogPostDialogProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    author: 'Admin',
    category: 'General',
    status: 'draft',
    tags: [],
    featured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [oldImagePublicId, setOldImagePublicId] = useState<string | null>(null);
  const [newImagePublicId, setNewImagePublicId] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        content: initialData.content,
        imageUrl: initialData.imageUrl || '',
        author: initialData.author,
        category: initialData.category || 'General',
        status: initialData.status || 'draft',
        tags: initialData.tags || [],
        featured: initialData.featured || false,
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        metaKeywords: initialData.metaKeywords || [],
      });
      setImagePreview(initialData.imageUrl || '');
      // Extract old public ID from Cloudinary URL if present
      if (initialData.imageUrl?.includes('cloudinary')) {
        const publicId = extractPublicId(initialData.imageUrl);
        setOldImagePublicId(publicId);
      }
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        author: 'Admin',
        category: 'General',
        status: 'draft',
        tags: [],
        featured: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
      });
      setImagePreview('');
      setOldImagePublicId(null);
    }
    setImageFile(null);
    setNewImagePublicId(null);
  }, [initialData, open]);

  const extractPublicId = (url: string): string => {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return `blogs/${publicId}`;
    } catch {
      return '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteOldImage = async (publicId: string) => {
    try {
      await fetch(API_UPLOAD, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleRemoveImage = async () => {
    if (newImagePublicId) {
      await deleteOldImage(newImagePublicId);
    } else if (oldImagePublicId) {
      await deleteOldImage(oldImagePublicId);
    }
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }));
    setImagePreview('');
    setImageFile(null);
    setNewImagePublicId(null);
  };

  const handleChange = (field: keyof BlogPost, value: any) => {
    setFormData((prev) => {
      const updates: any = { [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title' && !initialData) {
        updates.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      // Auto-generate meta title from title if empty
      if (field === 'title' && !prev.metaTitle) {
        updates.metaTitle = value;
      }

      return { ...prev, ...updates };
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.metaKeywords?.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        metaKeywords: [...(prev.metaKeywords || []), keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords?.filter((k) => k !== keyword) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalData = { ...formData };

      // If there's a new image file, upload it first
      if (imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', imageFile);
        formDataToSend.append('folder', 'blogs');

        const response = await fetch(API_UPLOAD, {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        finalData.imageUrl = data.imageUrl;
        setNewImagePublicId(data.publicId);

        // Delete old image if exists (during edit)
        if (oldImagePublicId) {
          await deleteOldImage(oldImagePublicId);
        }
      }

      // Now submit the post with image URL included
      onSubmit(finalData);
      toast.success('Post saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the blog post details below.'
              : 'Fill in the details to create a new blog post.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                    required
                    disabled={!!initialData}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly version of the title (cannot be changed after creation)
                  </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">
                    Excerpt <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                    required
                  />
                </div>

                {/* Author, Category, Status - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      placeholder="Author name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange('status', value as 'draft' | 'published')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Featured Image Upload */}
                <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
                  <Label>Featured Image</Label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* File Input */}
                  {!imagePreview && (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-input"
                      />
                      <label htmlFor="image-input" className="cursor-pointer">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload or drag image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                      </label>
                    </div>
                  )}

                  {/* File Info */}
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">✓ Image selected: {imageFile.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Image will be uploaded to Cloudinary when you click "{initialData ? 'Update Post' : 'Create Post'}"
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured Post</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark this post as featured on homepage
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleChange('featured', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your blog post content here... (Supports Markdown)"
                  rows={20}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting. Use **bold**, *italic*, # Heading, etc.
                </p>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {/* Meta Title */}
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder="SEO optimized title (60 chars max)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaTitle?.length || 0}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="SEO optimized description (160 chars max)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      id="metaKeywords"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      placeholder="Add a keyword and press Enter"
                    />
                    <Button type="button" onClick={handleAddKeyword} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.metaKeywords?.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="gap-1">
                        {keyword}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add relevant keywords for SEO purposes
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  {imageFile ? 'Uploading Image...' : 'Saving...'}
                </>
              ) : (
                initialData ? 'Update Post' : 'Create Post'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
