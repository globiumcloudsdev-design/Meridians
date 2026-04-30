'use client';

import { useMemo } from 'react';
import { ClassItem } from '@/lib/types/class';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface ClassTableProps {
  classes: ClassItem[];
  onEdit: (classItem: ClassItem) => void;
  onDelete: (classItem: ClassItem) => void;
}

export function ClassTable({ classes, onEdit, onDelete }: ClassTableProps) {
  const columns: DataTableColumn<ClassItem>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Class Name',
        sortable: true,
        searchable: true,
        className: 'font-semibold text-slate-900 min-w-48',
        render: (item) => <span>{item.name}</span>,
      },
      {
        key: 'fees',
        label: 'Fees (PKR)',
        sortable: true,
        className: 'font-medium text-emerald-600',
        render: (item) => <span>{item.fees.toLocaleString('en-PK')}</span>,
      },
      {
        key: 'description',
        label: 'Description',
        className: 'max-w-xs',
        render: (item) => <span className="truncate block text-slate-500 text-xs" title={item.description}>{item.description}</span>,
      },
      {
        key: 'isActive',
        label: 'Status',
        className: 'text-center',
        render: (item) => (
          <div className="flex justify-center">
            {item.isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <Eye className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                <EyeOff className="w-3 h-3" />
                Inactive
              </span>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const actions: DataTableAction<ClassItem>[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
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
      data={classes}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search classes..."
      rowKey="_id"
      initialPageSize={10}
    />
  );
}
