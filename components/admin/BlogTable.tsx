'use client';

import { useMemo } from 'react';
import { BlogPost } from '@/lib/types';
import { DataTable, DataTableColumn, DataTableFilter, DataTableAction } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface BlogTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onView: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete, onView }: BlogTableProps) {
  // Define columns with custom renderers
  const columns: DataTableColumn<BlogPost>[] = useMemo(
    () => [
      {
        key: 'title',
        label: 'Title',
        sortable: true,
        searchable: true,
className: 'font-medium max-w-75 min-w-48',
        render: (post) => <span className="truncate block text-black">{post.title}</span>,
      },
      {
        key: 'author',
        label: 'Author',
        sortable: true,
        searchable: true,
        className: 'min-w-32',
      },
      {
        key: 'category',
        label: 'Category',
        sortable: true,
        className: 'min-w-32',
        render: (post) =>
          post.category ? (
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          ) : null,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        className: 'min-w-32',
        render: (post) => (
          <Badge
            variant={post.status === 'published' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {post.status || 'draft'}
          </Badge>
        ),
      },
      {
        key: 'views',
        label: 'Views',
        sortable: true,
        className: 'text-center min-w-24',
        render: (post) => <span className="text-center block">{post.views || 0}</span>,
      },
      {
        key: 'likes',
        label: 'Likes',
        sortable: true,
        className: 'text-center min-w-24',
        render: (post) => <span className="text-center block">{post.likes || 0}</span>,
      },
      {
        key: 'publishedAt',
        label: 'Published',
        sortable: true,
        className: 'min-w-32',
        render: (post) => new Date(post.publishedAt).toLocaleDateString(),
      },
    ],
    []
  );

  // Define filters
  const filters: DataTableFilter[] = useMemo(() => {
    const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    const statuses = Array.from(new Set(posts.map((p) => p.status).filter(Boolean)));

    return [
      {
        key: 'category',
        label: 'Category',
        options: categories.map((cat) => ({ label: cat || '', value: cat || '' })),
      },
      {
        key: 'status',
        label: 'Status',
        options: statuses.map((status) => ({ label: status || '', value: status || '' })),
      },
    ];
  }, [posts]);

  // Define actions
  const actions: DataTableAction<BlogPost>[] = [
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
      data={posts}
      columns={columns}
      filters={filters}
      actions={actions}
      searchPlaceholder="Search blog posts..."
      rowKey="_id"
      initialPageSize={10}
      enableSelection={true}
      onExport={(data) => {
        const csv = [
          ['Title', 'Author', 'Category', 'Status', 'Views', 'Likes', 'Published At'].join(','),
          ...data.map((post) =>
            [
              post.title,
              post.author,
              post.category || '',
              post.status || '',
              post.views || 0,
              post.likes || 0,
              new Date(post.publishedAt).toLocaleDateString(),
            ]
              .map((cell) => `"${cell}"`)
              .join(',')
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-posts-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    />
  );
}
