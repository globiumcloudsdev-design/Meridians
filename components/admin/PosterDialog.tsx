'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { IPoster } from '@/lib/types';
import { API_UPLOAD } from '@/lib/api/endpoints';

interface PosterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IPoster>) => void;
  initialData?: IPoster;
}

const DEFAULT_FORM: Partial<IPoster> = {
  imageUrl: '',
  title: '',
  subtitle: '',
  isActive: false,
  buttonText: '',
  buttonUrl: '',
};

export function PosterDialog({ open, onClose, onSubmit, initialData }: PosterDialogProps) {
  const [formData, setFormData] = useState<Partial<IPoster>>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [oldImagePublicId, setOldImagePublicId] = useState<string | null>(null);
  const [newImagePublicId, setNewImagePublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        imageUrl: initialData.imageUrl,
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        isActive: initialData.isActive,
        buttonText: initialData.buttonText || '',
        buttonUrl: initialData.buttonUrl || '',
      });
      setImagePreview(initialData.imageUrl);

      if (initialData.imageUrl?.includes('cloudinary')) {
        setOldImagePublicId(extractPublicId(initialData.imageUrl));
      } else {
        setOldImagePublicId(null);
      }
    } else {
      setFormData(DEFAULT_FORM);
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
      return `posters/${publicId}`;
    } catch {
      return '';
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      await fetch(API_UPLOAD, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
    } catch (error) {
      console.error('Delete image error:', error);
    }
  };

  const handleChange = (field: keyof IPoster, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (newImagePublicId) {
      await deleteImage(newImagePublicId);
    } else if (oldImagePublicId) {
      await deleteImage(oldImagePublicId);
    }

    setImageFile(null);
    setImagePreview('');
    setNewImagePublicId(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const finalData: Partial<IPoster> = { ...formData };

      if (imageFile) {
        const form = new FormData();
        form.append('file', imageFile);
        form.append('folder', 'posters');

        const uploadResponse = await fetch(API_UPLOAD, {
          method: 'POST',
          body: form,
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        finalData.imageUrl = uploadData.imageUrl;
        setNewImagePublicId(uploadData.publicId);

        if (oldImagePublicId) {
          await deleteImage(oldImagePublicId);
        }
      }

      if (!finalData.imageUrl) {
        toast.error('Poster image is required');
        return;
      }

      onSubmit(finalData);
    } catch (error) {
      console.error('Error saving poster:', error);
      toast.error('Failed to save poster');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-lg leading-none font-semibold">
            {initialData ? 'Edit Poster' : 'Create Poster'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {initialData
              ? 'Update this homepage poster.'
              : 'Create a new poster for homepage overlay.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poster-image">Poster Image</Label>
            <div className="border border-dashed border-border rounded-lg p-4">
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Poster preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="h-40 w-full rounded-md bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <input
                    id="poster-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {imagePreview && (
                <Input
                  id="poster-image"
                  type="file"
                  accept="image/*"
                  className="mt-3"
                  onChange={handleImageChange}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Admissions Open"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Secure your seat for the new academic year"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Apply Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonUrl">Button URL</Label>
              <Input
                id="buttonUrl"
                value={formData.buttonUrl || ''}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                placeholder="/admission-form"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Set Active</p>
              <p className="text-xs text-muted-foreground">Only one poster should be active at a time.</p>
            </div>
            <Switch
              checked={Boolean(formData.isActive)}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={uploading}>
              {uploading ? 'Saving...' : initialData ? 'Update Poster' : 'Create Poster'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
