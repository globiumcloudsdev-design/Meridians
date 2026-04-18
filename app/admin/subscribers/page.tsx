'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Trash2 } from 'lucide-react';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { toast } from 'sonner';
import { Subscriber } from '@/lib/types';
import { API_SUBSCRIBERS } from '@/lib/api/endpoints';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState<Subscriber | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSubscribers(
        subscribers.filter((sub) =>
          sub.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchTerm, subscribers]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(API_SUBSCRIBERS);
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
        setFilteredSubscribers(data);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Error loading subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (subscriber: Subscriber) => {
    setDeletingSubscriber(subscriber);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingSubscriber) return;
    try {
      const response = await fetch(`${API_SUBSCRIBERS}/${deletingSubscriber._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setSubscribers(subscribers.filter((sub) => sub._id !== deletingSubscriber._id));
        setFilteredSubscribers(filteredSubscribers.filter((sub) => sub._id !== deletingSubscriber._id));
        toast.success('Subscriber deleted');
        setDeleteConfirmOpen(false);
        setDeletingSubscriber(null);
      } else {
        toast.error('Failed to delete subscriber');
      }
    } catch (error) {
      toast.error('Error deleting subscriber');
    }
  };

  const handleExportCSV = (data: Subscriber[]) => {
    const csv = data
      .map((sub) => `"${sub.email}","${new Date(sub.subscribedAt).toLocaleDateString()}"`)
      .join('\n');
    const header = '"Email","Subscribed Date"\n';
    const fullCSV = header + csv;
    const blob = new Blob([fullCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  const handleCopyEmails = (data: Subscriber[]) => {
    const emails = data.map((sub) => sub.email).join('\n');
    navigator.clipboard.writeText(emails);
    toast.success('All emails copied to clipboard');
  };

  const columns: DataTableColumn<Subscriber>[] = [
    {
      key: 'email',
      label: 'Email',
      searchable: true,
      render: (row) => <span className="font-mono text-sm">{row.email}</span>,
    },
    {
      key: 'subscribedAt',
      label: 'Subscribed Date',
      render: (row) => new Date(row.subscribedAt).toLocaleDateString(),
    },
  ];

  const actions: DataTableAction<Subscriber>[] = [
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: Subscriber) => handleDelete(row),
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Newsletter Subscribers</h1>
        <p className="text-muted-foreground mt-2">
          Manage newsletter subscription list ({subscribers.length} total)
        </p>
      </div>
      <DataTable
        data={filteredSubscribers}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search by email..."
        onExport={handleExportCSV}
        rowKey="_id"
        initialPageSize={10}
        customFilters={
          <div className="flex gap-2">
            <Button
              onClick={() => handleCopyEmails(filteredSubscribers)}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
          </div>
        }
      />
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingSubscriber?.email}
        title="Delete Subscriber"
        description={`Are you sure you want to delete ${deletingSubscriber?.email} from the subscriber list? This action cannot be undone.`}
      />
    </div>
  );
}
