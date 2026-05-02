'use client';

import { useMemo } from 'react';
import { TestItem } from '@/lib/types/test';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Edit, Eye, Trash2, FileQuestion, EyeOff, Clock } from 'lucide-react';

interface TestTableProps {
  tests: TestItem[];
  onEdit: (test: TestItem) => void;
  onDelete: (test: TestItem) => void;
  onView: (test: TestItem) => void;
}

export function TestTable({ tests, onEdit, onDelete, onView }: TestTableProps) {
  const columns: DataTableColumn<TestItem>[] = useMemo(
    () => [
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
        className: 'font-medium min-w-48',
        render: (test) => (
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-emerald-600" />
            <span className="truncate block text-slate-900">{test.title}</span>
          </div>
        ),
      },
      {
        key: 'class',
        label: 'Class',
        render: (test) => (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
            {typeof test.class === 'object' ? test.class.name : 'Unknown Class'}
          </span>
        ),
      },
      {
        key: 'mcqs',
        label: 'Questions',
        sortable: true,
        render: (test) => (
          <span className="text-sm font-medium text-slate-700">
            {test.mcqs?.length || 0} MCQs
          </span>
        ),
      },
      {
        key: 'totalMarks',
        label: 'Total Marks',
        sortable: true,
        render: (test) => (
          <span className="text-sm font-bold text-emerald-600">
            {test.totalMarks}
          </span>
        ),
      },
      {
        key: 'timeLimit',
        label: 'Time/Ques',
        sortable: true,
        render: (test) => (
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Clock className="w-3.5 h-3.5" />
            {test.timeLimit || 30}s
          </div>
        ),
      },
      {
        key: 'isActive',
        label: 'Status',
        render: (test) => (
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            test.isActive 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {test.isActive ? (
              <>
                <Eye className="w-3 h-3" />
                Active
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                Inactive
              </>
            )}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created On',
        sortable: true,
        render: (test) => new Date(test.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const actions: DataTableAction<TestItem>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: onView,
      variant: 'ghost',
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      variant: 'ghost',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'ghost',
      className: 'text-destructive hover:text-destructive',
    },
  ];

  return (
    <DataTable
      data={tests}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search tests..."
      rowKey="_id"
      initialPageSize={10}
    />
  );
}
