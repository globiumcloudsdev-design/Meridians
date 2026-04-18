// components/admin/VideosTable.tsx
'use client';

import { useMemo } from 'react';
import { DataTable, DataTableColumn, DataTableFilter, DataTableAction } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Video, Link as LinkIcon } from 'lucide-react';
import { VideoResponse } from '@/lib/types/uploadVideo';

interface VideosTableProps {
  videos: VideoResponse[];
  onEdit: (video: VideoResponse) => void;
  onDelete: (video: VideoResponse) => void;
  onView: (video: VideoResponse) => void;
}

export function VideosTable({ videos, onEdit, onDelete, onView }: VideosTableProps) {
  // Define columns with custom renderers
  const columns: DataTableColumn<VideoResponse>[] = useMemo(
    () => [
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
        className: 'font-medium max-w-75 min-w-48',
        render: (video) => (
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="truncate block text-black">{video.title}</span>
          </div>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        sortable: true,
        searchable: true,
        className: 'max-w-md min-w-64',
        render: (video) => (
          <span className="truncate block text-muted-foreground text-sm">
            {video.description}
          </span>
        ),
      },
      {
        key: 'category',
        label: 'Category',
        sortable: true,
        className: 'min-w-32',
        render: (video) =>
          video.category ? (
            <Badge variant="outline" className="capitalize">
              {video.category}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Uncategorized
            </Badge>
          ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        className: 'min-w-32',
        render: (video) => {
          const statusConfig = {
            active: { label: 'Active', variant: 'default' as const },
            inactive: { label: 'Inactive', variant: 'secondary' as const },
            draft: { label: 'Draft', variant: 'outline' as const },
          };
          const config = statusConfig[video.status];
          return (
            <Badge variant={config.variant} className="capitalize">
              {config.label}
            </Badge>
          );
        },
      },
      // {
      //   key: 'link',
      //   label: 'Video Link',
      //   sortable: false,
      //   className: 'min-w-48',
      //   render: (video) => (
      //     <a
      //       href={video.link}
      //       target="_blank"
      //       rel="noopener noreferrer"
      //       className="flex items-center gap-1 text-primary hover:underline text-sm"
      //     >
      //       <LinkIcon className="h-3 w-3" />
      //       <span className="truncate max-w-32">Watch Video</span>
      //     </a>
      //   ),
      // },
      {
        key: 'author',
        label: 'Author',
        sortable: true,
        className: 'min-w-32',
        render: (video) => (
          <span className="text-sm text-muted-foreground">
            {video.author || 'Admin'}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        className: 'min-w-32',
        render: (video) => new Date(video.createdAt).toLocaleDateString(),
      },
      {
        key: 'updatedAt',
        label: 'Last Updated',
        sortable: true,
        className: 'min-w-32',
        render: (video) => new Date(video.updatedAt).toLocaleDateString(),
      },
    ],
    []
  );

  // Define filters
  const filters: DataTableFilter[] = useMemo(() => {
    const categories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)));
    const statuses = ['active', 'inactive', 'draft'];

    return [
      {
        key: 'category',
        label: 'Category',
        options: categories.map((cat) => ({ label: cat || '', value: cat || '' })),
      },
      {
        key: 'status',
        label: 'Status',
        options: statuses.map((status) => ({ label: status, value: status })),
      },
    ];
  }, [videos]);

  // Define actions
  const actions: DataTableAction<VideoResponse>[] = [
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
      data={videos}
      columns={columns}
      filters={filters}
      actions={actions}
      searchPlaceholder="Search videos by title, description, or category..."
      rowKey="_id"
      initialPageSize={10}
      enableSelection={true}
      onExport={(data) => {
        const csv = [
          ['Title', 'Description', 'Category', 'Status', 'Video Link', 'Created At', 'Updated At'].join(','),
          ...data.map((video) =>
            [
              video.title,
              video.description,
              video.category || 'Uncategorized',
              video.status,
              video.link,
              new Date(video.createdAt).toLocaleDateString(),
              new Date(video.updatedAt).toLocaleDateString(),
            ]
              .map((cell) => `"${cell}"`)
              .join(',')
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `videos-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    />
  );
}