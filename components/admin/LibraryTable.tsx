'use client';

import { useMemo } from 'react';
import { LibraryItem } from '@/lib/types/library';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Edit, Eye, Trash2, FileText } from 'lucide-react';

interface LibraryTableProps {
  items: LibraryItem[];
  onEdit: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
  onView: (item: LibraryItem) => void;
}

export function LibraryTable({ items, onEdit, onDelete, onView }: LibraryTableProps) {
  const columns: DataTableColumn<LibraryItem>[] = useMemo(
    () => [
      {
        key: 'thumbnail',
        label: 'Cover',
        className: 'w-16',
        render: (item) => (
          <div className="w-12 h-16 rounded overflow-hidden shadow-sm border bg-muted">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          </div>
        ),
      },
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
        className: 'font-medium min-w-48',
        render: (item) => <span className="truncate block text-slate-900">{item.title}</span>,
      },
      {
        key: 'description',
        label: 'Description',
        className: 'max-w-xs',
        render: (item) => <span className="truncate block text-slate-500 text-xs">{item.description}</span>,
      },
      {
        key: 'pdfUrl',
        label: 'PDF',
        render: (item) => (
          <a
            href={item.pdfUrl}
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
        render: (item) => new Date(item.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const actions: DataTableAction<LibraryItem>[] = [
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
      data={items}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search library..."
      rowKey="_id"
      initialPageSize={10}
    />
  );
}
