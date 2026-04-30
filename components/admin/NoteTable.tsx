'use client';

import { useMemo } from 'react';
import { NoteItem } from '@/lib/types/note';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Edit, Eye, Trash2, FileText } from 'lucide-react';

interface NoteTableProps {
  notes: NoteItem[];
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
  onView: (note: NoteItem) => void;
}

export function NoteTable({ notes, onEdit, onDelete, onView }: NoteTableProps) {
  const columns: DataTableColumn<NoteItem>[] = useMemo(
    () => [
      {
        key: 'subject',
        label: 'Subject',
        sortable: true,
        searchable: true,
        className: 'font-medium min-w-48',
        render: (note) => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="truncate block text-slate-900">{note.subject}</span>
          </div>
        ),
      },
      {
        key: 'class',
        label: 'Class',
        render: (note) => (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
            {typeof note.class === 'object' ? note.class.name : 'Unknown Class'}
          </span>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        className: 'max-w-xs',
        render: (note) => <span className="truncate block text-slate-500 text-xs">{note.description}</span>,
      },
      {
        key: 'pdfUrl',
        label: 'PDF',
        render: (note) => (
          <a
            href={note.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:underline font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            View PDF
          </a>
        ),
      },
      {
        key: 'createdAt',
        label: 'Added On',
        sortable: true,
        render: (note) => new Date(note.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const actions: DataTableAction<NoteItem>[] = [
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
      data={notes}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search notes..."
      rowKey="_id"
      initialPageSize={10}
    />
  );
}
