'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ClipboardList, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TestTable } from '@/components/admin/TestTable';
import { TestDialog } from '@/components/admin/TestDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { TestItem, TestFormValues } from '@/lib/types';
import { API_TESTS, API_TEST_BY_ID } from '@/lib/api/endpoints';

export default function AdminTests() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTest, setEditTest] = useState<TestItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTest, setDeleteTest] = useState<TestItem | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_TESTS);
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      } else {
        toast.error('Failed to load tests');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Error loading tests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditTest(null);
    setDialogOpen(true);
  };

  const handleEdit = (test: TestItem) => {
    setEditTest(test);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditTest(null);
  };

  const handleDialogSubmit = async (formData: TestFormValues) => {
    try {
      const method = editTest ? 'PUT' : 'POST';
      const url = editTest ? API_TEST_BY_ID(editTest._id) : API_TESTS;

      const payload = {
        title: formData.title,
        description: formData.description,
        classId: formData.classId,
        mcqs: formData.mcqs,
        totalMarks: formData.totalMarks,
        correctAnswerMarks: formData.correctAnswerMarks,
        passingMarks: formData.passingMarks,
        timeLimit: formData.timeLimit,
        isActive: formData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editTest ? 'Test updated successfully' : 'Test created successfully');
        fetchTests();
        handleDialogClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error saving test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Error saving test');
    }
  };

  const handleDelete = (test: TestItem) => {
    setDeleteTest(test);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTest) return;
    try {
      const response = await fetch(API_TEST_BY_ID(deleteTest._id), { method: 'DELETE' });
      if (response.ok) {
        toast.success('Test deleted successfully');
        setTests(tests.filter((t) => t._id !== deleteTest._id));
        setDeleteDialogOpen(false);
        setDeleteTest(null);
      } else {
        toast.error('Error deleting test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Error deleting test');
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteTest(null);
  };

  const handleView = (test: TestItem) => {
    window.open(`/tests/${test._id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tests Management</h1>
          </div>
          <p className="text-slate-500 mt-2 font-medium">Create and manage MCQ-based tests with timers</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading tests...</p>
          </CardContent>
        </Card>
      ) : tests.length === 0 ? (
        <Card className="border-dashed border-2 border-emerald-100 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No tests found</p>
            <p className="text-slate-500 mb-6 text-center max-w-md">Start by creating your first MCQ test with timer and scoring.</p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
              onClick={handleAdd}
            >
              Create First Test
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden">
          <TestTable
            tests={tests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      <TestDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={editTest || undefined}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTest?.title}
      />
    </div>
  );
}
