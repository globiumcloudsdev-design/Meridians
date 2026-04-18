'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Edit } from 'lucide-react';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { contactReplyTemplate } from '@/lib/emailTemplates';
import { toast } from 'sonner';
import { ContactMessage } from '@/lib/types';
import { API_CONTACT, API_SEND_EMAIL } from '@/lib/api/endpoints';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  // No need for expandedId with DataTable
  const [isLoading, setIsLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [sending, setSending] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_CONTACT);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.sort((a: ContactMessage, b: ContactMessage) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (msg: ContactMessage) => {
    setDeletingMessage(msg);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingMessage) return;
    try {
      const response = await fetch(`${API_CONTACT}/${deletingMessage._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== deletingMessage._id));
        toast.success('Message deleted');
        setDeleteConfirmOpen(false);
        setDeletingMessage(null);
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  const handleMarkRead = (id: string) => {
    setMessages(messages.map((msg) =>
      msg._id === id ? { ...msg, isRead: !msg.isRead } : msg
    ));
  };

  const handleReply = (msg: ContactMessage) => {
    setReplyingTo(msg);
    setReplyMessage('');
    setReplyDialogOpen(true);
  };

  const sendReplyEmail = async () => {
    if (!replyingTo) return;
    setSending(true);
    try {
      const html = contactReplyTemplate({ name: replyingTo.name, reply: replyMessage });
      const res = await fetch(API_SEND_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: replyingTo.email,
          subject: 'Reply from Meridian School',
          html,
        }),
      });
      if (res.ok) {
        // Auto-mark as read and update status to "replied"
        const updateRes = await fetch(`${API_CONTACT}/${replyingTo._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'replied',
            isRead: true,
          }),
        });

        if (updateRes.ok) {
          setMessages(messages.map(msg =>
            msg._id === replyingTo._id
              ? { ...msg, status: 'replied', isRead: true }
              : msg
          ));
          toast.success('Reply email sent and status updated!');
          setReplyDialogOpen(false);
        } else {
          toast.success('Reply email sent!');
          setReplyDialogOpen(false);
        }
      } else {
        toast.error('Failed to send email');
      }
    } catch (err) {
      toast.error('Error sending email');
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  const columns: DataTableColumn<ContactMessage>[] = [
    {
      key: 'name',
      label: 'Name',
      searchable: true,
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name} {!row.isRead && <span className="w-2 h-2 bg-primary rounded-full inline-block ml-1" />}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => (
        <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{row.email}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {row.status === 'replied' ? 'Replied' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'message',
      label: 'Message',
      render: (row) => <span className="whitespace-pre-wrap text-foreground/80">{row.message}</span>,
    },
  ];

  const actions: DataTableAction<ContactMessage>[] = [
    {
      label: 'Reply',
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: ContactMessage) => handleReply(row),
      variant: 'default',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: ContactMessage) => handleDelete(row),
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">
          Manage contact form submissions ({unreadCount} unread)
        </p>
      </div>
      <DataTable
        data={messages}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search by name or email..."
        rowKey="_id"
        initialPageSize={10}
      />
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {replyingTo?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input disabled value={replyingTo?.email || ''} />
            <Textarea
              placeholder="Write your reply..."
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button onClick={sendReplyEmail} disabled={sending || !replyMessage}>
              {sending ? 'Sending...' : 'Send Reply Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingMessage?.name}
        title="Delete Message"
        description={`Are you sure you want to delete the message from ${deletingMessage?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
