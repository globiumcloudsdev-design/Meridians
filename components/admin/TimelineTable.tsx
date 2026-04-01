'use client';

import { useMemo } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, DataTableAction, DataTableColumn } from '@/components/ui/data-table';
import { TimelineEvent } from '@/lib/types';

interface TimelineTableProps {
  events: TimelineEvent[];
  onEdit: (event: TimelineEvent) => void;
  onDelete: (event: TimelineEvent) => void;
}

export function TimelineTable({ events, onEdit, onDelete }: TimelineTableProps) {
  const columns: DataTableColumn<TimelineEvent>[] = useMemo(
    () => [
      {
        key: 'order',
        label: 'Order',
        sortable: true,
        className: 'min-w-20 text-center',
        render: (event) => <span className="block text-center">{event.order}</span>,
      },
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
        className: 'min-w-40 font-medium',
      },
      {
        key: 'date',
        label: 'Date',
        sortable: true,
        searchable: true,
        className: 'min-w-32',
      },
      {
        key: 'icon',
        label: 'Icon',
        sortable: true,
        searchable: true,
        className: 'min-w-32',
      },
      {
        key: 'description',
        label: 'Description',
        searchable: true,
        className: 'max-w-80 min-w-64',
        render: (event) => <span className="block truncate">{event.description}</span>,
      },
    ],
    []
  );

  const actions: DataTableAction<TimelineEvent>[] = [
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
      data={events}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search timeline events..."
      rowKey="_id"
      initialPageSize={10}
      enableSelection={true}
      onExport={(data) => {
        const csv = [
          ['Order', 'Title', 'Date', 'Icon', 'Description'].join(','),
          ...data.map((event) =>
            [event.order, event.title, event.date, event.icon, event.description]
              .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
              .join(',')
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeline-events-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    />
  );
}
