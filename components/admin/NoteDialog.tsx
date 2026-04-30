'use client';

import { useState, useEffect } from 'react';
import { NoteItem, NoteFormValues } from '@/lib/types/note';
import { ClassItem } from '@/lib/types/class';
import { API_CLASSES } from '@/lib/api/endpoints';
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
} from "@/components/ui/select";
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: NoteItem;
}

export function NoteDialog({ open, onClose, onSubmit, initialData }: NoteDialogProps) {
  const [formData, setFormData] = useState<NoteFormValues>({
    subject: '',
    description: '',
    classId: '',
  });
  
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(API_CLASSES);
      if (response.ok) {
        const data = await response.json();
        // Only show active classes
        const activeClasses = data.filter((c: ClassItem) => c.isActive);
        setClasses(activeClasses);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject,
        description: initialData.description,
        classId: typeof initialData.class === 'string' 
          ? initialData.class 
          : initialData.class._id,
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        classId: '',
      });
    }
    setPdfFile(null);
  }, [initialData, open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!initialData && !pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('classId', formData.classId);
      
      if (pdfFile) {
        formDataToSend.append('pdf', pdfFile);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save note');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Note' : 'Add New Note'}</DialogTitle>
          <DialogDescription>
            Fill in the details to add a PDF note.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  required
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Mathematics, Science"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the note"
                rows={3}
                required
              />
            </div>

            {/* PDF Upload */}
            <div className="space-y-3">
              <Label>PDF File</Label>
              <div className="border-2 border-dashed rounded-xl p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                {pdfFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-emerald-500 mb-2" />
                    <span className="text-sm font-medium truncate max-w-full px-4">{pdfFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setPdfFile(null)}
                    >
                      Remove PDF
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="note-pdf-upload" className="cursor-pointer block py-4">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-slate-600">Click to upload PDF note</span>
                    <Input
                      id="note-pdf-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfChange}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Max 9MB. Only PDF files are allowed.</p>
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
                initialData ? 'Update Note' : 'Add Note'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
