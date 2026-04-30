'use client';

import { useState, useEffect } from 'react';
import { LibraryItem, LibraryFormValues } from '@/lib/types/library';
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
import { X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { API_UPLOAD } from '@/lib/api/endpoints';
import { toast } from 'sonner';

interface LibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: LibraryItem;
}

export function LibraryDialog({ open, onClose, onSubmit, initialData }: LibraryDialogProps) {
  const [formData, setFormData] = useState<LibraryFormValues>({
    title: '',
    description: '',
    thumbnail: '',
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        thumbnail: initialData.thumbnail,
      });
      setThumbnailPreview(initialData.thumbnail);
    } else {
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
      });
      setThumbnailPreview('');
    }
    setThumbnailFile(null);
    setPdfFile(null);
  }, [initialData, open]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 9 * 1024 * 1024) {
        toast.error('PDF size must be less than 9MB');
        return;
      }
      setPdfFile(file);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('folder', folder);

    const response = await fetch(API_UPLOAD, {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}`);
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!initialData && !thumbnailFile) {
      toast.error('Please select a thumbnail image');
      return;
    }

    if (!initialData && !pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      } else if (initialData) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      
      if (pdfFile) {
        formDataToSend.append('pdf', pdfFile);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save library item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Library Item' : 'Add New Library Item'}</DialogTitle>
          <DialogDescription>
            Fill in the details to add a book or PDF to the library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the book"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <Label>Thumbnail Image</Label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center bg-muted/30 hover:bg-muted/50 transition-colors relative">
                  {thumbnailPreview ? (
                    <div className="relative aspect-3/4 w-full max-w-[150px] mx-auto overflow-hidden rounded-lg shadow-md">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                          setFormData({ ...formData, thumbnail: '' });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="thumbnail-upload" className="cursor-pointer block py-4">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-xs font-medium text-slate-600">Upload Cover</span>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">Recommended ratio 3:4. Max 5MB.</p>
              </div>

              {/* PDF Upload */}
              <div className="space-y-3 flex flex-col h-full">
                <Label>PDF File</Label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center bg-muted/30 hover:bg-muted/50 transition-colors flex-1 flex flex-col justify-center">
                  {pdfFile ? (
                    <div className="flex flex-col items-center py-2">
                      <FileText className="w-10 h-10 text-emerald-500 mb-2" />
                      <span className="text-xs font-medium truncate max-w-full px-2">{pdfFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                           setPdfFile(null);
                           // Only clear the URL if it was a previously uploaded file, not an external link that they might want to revert to.
                           // Actually, let's keep it simple.
                        }}
                      >
                        Remove PDF
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="pdf-upload" className="cursor-pointer block py-2">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-xs font-medium text-slate-600">Upload PDF</span>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handlePdfChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">Max 9MB. Only PDF files allowed.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]">
              {uploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                initialData ? 'Update Item' : 'Add to Library'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
