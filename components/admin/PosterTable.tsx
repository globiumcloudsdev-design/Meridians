'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, DataTableAction, DataTableColumn } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { IPoster } from '@/lib/types';

interface PosterTableProps {
  posters: IPoster[];
  onEdit: (poster: IPoster) => void;
  onDelete: (poster: IPoster) => void;
  onToggleActive: (poster: IPoster, nextActive: boolean) => void;
}

export function PosterTable({ posters, onEdit, onDelete, onToggleActive }: PosterTableProps) {
  const columns: DataTableColumn<IPoster>[] = useMemo(
    () => [
      {
        key: 'imageUrl',
        label: 'Preview',
        className: 'min-w-28',
        render: (poster) => (
          <div className="relative w-20 h-12 rounded-md overflow-hidden border border-border">
            <Image src={poster.imageUrl} alt={poster.title || 'Poster preview'} fill className="object-cover" />
          </div>
        ),
      },
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
        className: 'min-w-48 font-medium',
        render: (poster) => <span className="block truncate">{poster.title || 'Untitled Poster'}</span>,
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        searchable: true,
        className: 'min-w-64 max-w-80',
        render: (poster) => <span className="block truncate">{poster.subtitle || '-'}</span>,
      },
      {
        key: 'isActive',
        label: 'Active',
        sortable: true,
        className: 'min-w-32',
        render: (poster) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={poster.isActive}
              onCheckedChange={(checked) => onToggleActive(poster, checked)}
            />
            <span className="text-xs text-muted-foreground">
              {poster.isActive ? 'Live' : 'Inactive'}
            </span>
          </div>
        ),
      },
    ],
    [onToggleActive]
  );

  const actions: DataTableAction<IPoster>[] = [
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
      data={posters}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search posters..."
      rowKey="_id"
      initialPageSize={10}
      enableSelection={true}
    />
  );
}
