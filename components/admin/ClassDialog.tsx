'use client';

import { useState, useEffect } from 'react';
import { ClassItem, ClassFormValues } from '@/lib/types/class';
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
import { Switch } from '@/components/ui/switch';
import { Loader2, School } from 'lucide-react';

interface ClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ClassItem>) => void;
  initialData?: ClassItem;
}

export function ClassDialog({ open, onClose, onSubmit, initialData }: ClassDialogProps) {
  const [formData, setFormData] = useState<ClassFormValues>({
    name: '',
    fees: 0,
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feesDisplay, setFeesDisplay] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        fees: initialData.fees,
        description: initialData.description,
        isActive: initialData.isActive,
      });
      setFeesDisplay(initialData.fees.toString());
    } else {
      setFormData({
        name: '',
        fees: 0,
        description: '',
        isActive: true,
      });
      setFeesDisplay('');
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <School className="w-4 h-4 text-emerald-600" />
            </div>
            <DialogTitle>{initialData ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          </div>
          <DialogDescription>
            {initialData ? 'Update the class details below.' : 'Fill in the details to add a new class.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">
              Class Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Matric, FSc Pre-Medical, ICS"
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Class Fees */}
          <div className="space-y-2">
            <Label htmlFor="fees" className="text-slate-700 font-medium">
              Class Fees (PKR) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fees"
              type="number"
              min="0"
              value={feesDisplay}
              onChange={(e) => {
                setFeesDisplay(e.target.value);
                setFormData({ ...formData, fees: parseInt(e.target.value) || 0 });
              }}
              placeholder="Enter fees amount"
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter class description, subjects offered, etc."
              rows={3}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Active/Inactive Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-slate-700 font-medium cursor-pointer">
                Class Status
              </Label>
              <p className="text-sm text-slate-500">
                {formData.isActive ? 'Class is currently active and visible' : 'Class is currently inactive and hidden'}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          <DialogFooter className="flex gap-4 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="border-slate-200 text-slate-600 hover:bg-transparent hover:text-slate-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px] shadow-lg shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                initialData ? 'Update Class' : 'Add Class'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
