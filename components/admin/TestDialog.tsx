'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { TestItem, TestFormValues, MCQ } from '@/lib/types/test';
import { ClassItem } from '@/lib/types/class';
import { API_CLASSES } from '@/lib/api/endpoints';
import { Plus, Trash2, Clock, Award, HelpCircle, FileQuestion, ClipboardList, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TestFormValues) => void;
  initialData?: TestItem;
}

const emptyMCQ: MCQ = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  marks: 1,
};

export function TestDialog({ open, onClose, onSubmit, initialData }: TestDialogProps) {
  const [formData, setFormData] = useState<TestFormValues>({
    title: '',
    description: '',
    classId: '',
    mcqs: [{ ...emptyMCQ }],
    totalMarks: 1,
    correctAnswerMarks: 1,
    passingMarks: 0,  // 0 means no default, will show placeholder
    timeLimit: 0,  // 0 means no default, will show placeholder
    isActive: true,
  });

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        classId: typeof initialData.class === 'string' ? initialData.class : initialData.class._id,
        mcqs: initialData.mcqs.length > 0 ? initialData.mcqs : [{ ...emptyMCQ }],
        totalMarks: initialData.totalMarks,
        correctAnswerMarks: initialData.correctAnswerMarks || 1,
        passingMarks: initialData.passingMarks || 0,  // Keep 0 for placeholder
        timeLimit: initialData.timeLimit || 0,
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        classId: '',
        mcqs: [{ ...emptyMCQ }],
        totalMarks: 1,
        correctAnswerMarks: 1,
        passingMarks: 0,
        timeLimit: 0,
        isActive: true,
      });
      setActiveTab('details');
    }
  }, [initialData, open]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(API_CLASSES);
      if (response.ok) {
        const data = await response.json();
        const activeClasses = data.filter((cls: ClassItem) => cls.isActive);
        setClasses(activeClasses);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const addMCQ = () => {
    const newMCQ = { ...emptyMCQ, marks: 1 };
    const newMCQs = [...formData.mcqs, newMCQ];
    updateMCQsAndMarks(newMCQs);
  };

  const removeMCQ = (index: number) => {
    if (formData.mcqs.length === 1) {
      toast.error('At least one MCQ is required');
      return;
    }
    const newMCQs = formData.mcqs.filter((_, i) => i !== index);
    updateMCQsAndMarks(newMCQs);
  };

  const updateMCQ = (index: number, field: keyof MCQ, value: any) => {
    const newMCQs = formData.mcqs.map((mcq, i) => {
      if (i === index) {
        return { ...mcq, [field]: value };
      }
      return mcq;
    });
    updateMCQsAndMarks(newMCQs);
  };

  const updateMCQOption = (mcqIndex: number, optionIndex: number, value: string) => {
    const newMCQs = formData.mcqs.map((mcq, i) => {
      if (i === mcqIndex) {
        const newOptions = [...mcq.options];
        newOptions[optionIndex] = value;
        return { ...mcq, options: newOptions };
      }
      return mcq;
    });
    setFormData({ ...formData, mcqs: newMCQs });
  };

  const updateMCQsAndMarks = (newMCQs: MCQ[]) => {
    const totalMarks = newMCQs.reduce((sum, mcq) => sum + (mcq.marks || 1), 0);
    setFormData({ ...formData, mcqs: newMCQs, totalMarks });
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.classId) {
      toast.error('Class is required');
      return false;
    }
    if (formData.passingMarks < 1) {
      toast.error('Passing marks must be at least 1');
      return false;
    }
    if (formData.passingMarks > formData.totalMarks) {
      toast.error('Passing marks cannot be greater than total marks');
      return false;
    }
    if (formData.timeLimit > 0 && formData.timeLimit < 5) {
      toast.error('Time per question must be at least 5 seconds');
      return false;
    }
    if (formData.timeLimit > 300) {
      toast.error('Time per question cannot exceed 300 seconds');
      return false;
    }

    for (let i = 0; i < formData.mcqs.length; i++) {
      const mcq = formData.mcqs[i];
      if (!mcq.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return false;
      }
      for (let j = 0; j < 4; j++) {
        if (!mcq.options[j].trim()) {
          toast.error(`Option ${j + 1} for Question ${i + 1} is required`);
          return false;
        }
      }
      if (mcq.correctAnswer < 0 || mcq.correctAnswer > 3) {
        toast.error(`Correct answer for Question ${i + 1} must be selected`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            {initialData ? 'Edit Test' : 'Create New Test'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Modify test details and MCQ questions' 
              : 'Set up a new MCQ-based test with timer and scoring'}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('details');
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Test Details
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('questions');
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'questions'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            MCQ Questions ({formData.mcqs.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(95vh-200px)]">
          <ScrollArea className="flex-1 px-6 py-4">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Test Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mathematics Mid-Term Exam"
                    className="h-12"
                  />
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger id="class" className="h-12">
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the test..."
                    rows={3}
                  />
                </div>

                {/* Timer, Marks & Status */}
                <Card className="border-emerald-100">
                  <CardHeader className="pb-3">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Test Configuration
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeLimit" className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Time per Question (seconds)
                        </Label>
                        <Input
                          id="timeLimit"
                          type="number"
                          min={5}
                          max={300}
                          placeholder="Enter time (e.g., 30)"
                          value={formData.timeLimit === 0 ? '' : formData.timeLimit}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numValue = value === '' ? 0 : Number(value);
                            setFormData({
                              ...formData,
                              timeLimit: numValue
                            });
                          }}
                          className="h-11 w-full"
                        />
                        <p className="text-xs text-slate-500">Timer for each MCQ</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalMarks" className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          Total Marks (Auto)
                        </Label>
                        <Input
                          id="totalMarks"
                          type="number"
                          value={formData.totalMarks}
                          readOnly
                          className="h-11 bg-emerald-50 border-emerald-200 font-semibold text-emerald-700"
                        />
                        <p className="text-xs text-slate-500">Sum of all question marks</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          {formData.isActive ? 'Active (Visible to students)' : 'Inactive (Hidden)'}
                        </Label>
                      </div>
                      <div className="text-sm text-slate-500">
                        {formData.mcqs.length} Questions = {formData.totalMarks} Total Marks
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Passing Marks - Set while creating MCQs */}
                <Card className="border-emerald-200 bg-emerald-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="passingMarks" className="flex items-center gap-2 font-semibold text-slate-800">
                          <Award className="w-4 h-4 text-emerald-600" />
                          Passing Marks
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                          Minimum marks required to pass (out of {formData.totalMarks} total)
                        </p>
                      </div>
                      <Input
                        id="passingMarks"
                        type="number"
                        min={1}
                        placeholder="Enter passing marks"
                        value={formData.passingMarks || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, passingMarks: value === '' ? 0 : parseInt(value) });
                        }}
                        className="w-48 h-11 text-center font-bold text-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* MCQ Questions */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    MCQ Questions
                  </h3>
                  <Button
                    type="button"
                    onClick={addMCQ}
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.mcqs.map((mcq, index) => (
                    <Card key={index} className="border-slate-200">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Question {index + 1}
                          </span>
                          <Button
                            type="button"
                            onClick={() => removeMCQ(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0 px-4 pb-4">
                        <Textarea
                          value={mcq.question}
                          onChange={(e) => updateMCQ(index, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          rows={2}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mcq.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={mcq.correctAnswer === optIndex}
                                onChange={() => updateMCQ(index, 'correctAnswer', optIndex)}
                                className="w-4 h-4 text-emerald-600"
                              />
                              <Input
                                value={option}
                                onChange={(e) => updateMCQOption(index, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className={`h-10 ${mcq.correctAnswer === optIndex ? 'border-emerald-500 bg-emerald-50/30' : ''}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-slate-600">Marks:</Label>
                            <Input
                              type="number"
                              min={1}
                              value={mcq.marks}
                              onChange={(e) => updateMCQ(index, 'marks', parseInt(e.target.value) || 1)}
                              className="w-20 h-9"
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            Select the radio button next to the correct answer
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
            <div className="text-sm text-slate-500">
              {activeTab === 'questions' && (
                <span>{formData.mcqs.length} Questions | Total: {formData.totalMarks} Marks</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {activeTab === 'details' ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab('questions');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Next: Add Questions
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {initialData ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    initialData ? 'Update Test' : 'Create Test'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
