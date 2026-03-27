'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Trash2, CheckCircle, Circle, Edit } from 'lucide-react';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { admissionStatusTemplate } from '@/lib/emailTemplates';
import { toast } from 'sonner';
import { AdmissionQuery } from '@/lib/types';
import { API_ADMISSION } from '@/lib/api/endpoints';

export default function AdmissionQueriesPage() {
  const [queries, setQueries] = useState<AdmissionQuery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'replied'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusSending, setStatusSending] = useState(false);
  const [statusQuery, setStatusQuery] = useState<AdmissionQuery | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingQuery, setDeletingQuery] = useState<AdmissionQuery | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const getFilteredQueries = () => {
    let filtered = queries;
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.phone.includes(searchTerm)
      );
    }
    if (filterStatus === 'pending') {
      filtered = filtered.filter((q) => q.status === 'pending');
    } else if (filterStatus === 'replied') {
      filtered = filtered.filter((q) => q.status === 'replied');
    }
    return filtered;
  };

  const fetchQueries = async () => {
    try {
      const response = await fetch(API_ADMISSION);
      if (response.ok) {
        const data = await response.json();
        setQueries(data.sort((a: AdmissionQuery, b: AdmissionQuery) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching admission queries:', error);
      toast.error('Error loading admission queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    const query = queries.find(q => q._id === id);
    if (!query) return;
    const newStatus = query.status === 'pending' ? 'replied' : 'pending';
    setStatusQuery({ ...query, status: newStatus });
    setStatusDialogOpen(true);
  };

  const sendStatusEmail = async () => {
    if (!statusQuery) return;
    setStatusSending(true);
    try {
      const html = admissionStatusTemplate({ name: statusQuery.name, program: statusQuery.program, status: statusQuery.status });
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: statusQuery.email,
          subject: 'Admission Query Status Update',
          html,
        }),
      });
      if (res.ok) {
        // Update the query status in the database
        const updateRes = await fetch(`${API_ADMISSION}/${statusQuery._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: statusQuery.status }),
        });
        if (updateRes.ok) {
          setQueries(queries.map(q => q._id === statusQuery._id ? statusQuery : q));
          toast.success('Status updated and email sent!');
          setStatusDialogOpen(false);
        } else {
          toast.error('Email sent but failed to update status');
        }
      } else {
        toast.error('Failed to send email');
      }
    } catch (err) {
      toast.error('Error sending email');
    } finally {
      setStatusSending(false);
    }
  };

  const handleDelete = (query: AdmissionQuery) => {
    setDeletingQuery(query);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingQuery) return;
    try {
      const response = await fetch(`${API_ADMISSION}/${deletingQuery._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setQueries(queries.filter((q) => q._id !== deletingQuery._id));
        toast.success('Query deleted');
        setDeleteConfirmOpen(false);
        setDeletingQuery(null);
      } else {
        toast.error('Failed to delete query');
      }
    } catch (error) {
      toast.error('Error deleting query');
    }
  };

  const pendingCount = queries.filter((q) => q.status === 'pending').length;

  const columns: DataTableColumn<AdmissionQuery>[] = [
    {
      key: 'name',
      label: 'Name',
      searchable: true,
      render: (row: AdmissionQuery) => <span className="font-semibold text-foreground">{row.name}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: AdmissionQuery) => <a href={`mailto:${row.email}`} className="text-primary hover:underline flex items-center gap-1"><Mail className="w-4 h-4" />{row.email}</a>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row: AdmissionQuery) => <a href={`tel:${row.phone}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="w-4 h-4" />{row.phone}</a>,
    },
    {
      key: 'program',
      label: 'Program',
      render: (row: AdmissionQuery) => <span>{row.program}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdmissionQuery) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{row.status === 'replied' ? 'Replied' : 'Pending'}</span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      className: 'max-w-96 min-w-64',
      render: (row: AdmissionQuery) => <span className="truncate block text-foreground/80">{row.message}</span>,
    },
  ];

  const actions: DataTableAction<AdmissionQuery>[] = [
    {
      label: 'Change Status & Email',
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: AdmissionQuery) => handleToggleStatus(row._id),
      variant: 'outline',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: AdmissionQuery) => handleDelete(row),
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admission Queries</h1>
        <p className="text-muted-foreground mt-2">
          Manage admission inquiries ({pendingCount} pending)
        </p>
      </div>
      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'replied'] as const).map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={
              filterStatus === status
                ? 'bg-primary hover:bg-primary/90'
                : 'border-primary text-primary hover:bg-primary/50'
            }
          >
            {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Replied'}
          </Button>
        ))}
      </div>
      <DataTable
        data={getFilteredQueries()}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search by name, email, or phone..."
        rowKey="_id"
        initialPageSize={10}
      />
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="">
            <DialogTitle className="">Send Status Update Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{statusQuery?.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{statusQuery?.email}</p>
              </div>
              {/* <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-semibold text-foreground">{statusQuery?.program}</p>
              </div> */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">New Status</p>
                <p className={`font-semibold px-2 py-1 rounded w-fit ${statusQuery?.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {statusQuery?.status === 'replied' ? 'Replied' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Email Preview</p>
              <div className="border rounded p-4 bg-muted/10 max-h-64 overflow-y-auto text-sm">
                <div dangerouslySetInnerHTML={{ __html: statusQuery ? admissionStatusTemplate({ name: statusQuery.name, program: statusQuery.program, status: statusQuery.status }) : '' }} />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendStatusEmail} disabled={statusSending}>
              {statusSending ? 'Sending...' : 'Send Email & Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingQuery?.name}
        title="Delete Query"
        description={`Are you sure you want to delete the query from ${deletingQuery?.name} for ${deletingQuery?.program}? This action cannot be undone.`}
      />
    </div>
  );
}

