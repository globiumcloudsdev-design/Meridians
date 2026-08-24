'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mail,
  Trash2,
  Edit,
  Eye,
  Loader2,
  Download,
  GraduationCap,
  BookOpen,
  MessageCircle,
  MapPin,
  User,
  ExternalLink,
  Send,
} from 'lucide-react';
import { generateVoucherPDF } from '@/lib/utils/generateVoucherPDF';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { admissionStatusTemplate, quranAdmissionStatusTemplate } from '@/lib/emailTemplates';
import { toast } from 'sonner';
import { AdmissionQuery } from '@/lib/types';
import { API_ADMISSION } from '@/lib/api/endpoints';

export default function AdmissionQueriesPage() {
  const [queries, setQueries] = useState<AdmissionQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'school' | 'online_quran'>('school');

  // Search & Filter States
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [schoolFilterStatus, setSchoolFilterStatus] = useState<string>('all');

  const [quranSearchTerm, setQuranSearchTerm] = useState('');
  const [quranFilterStatus, setQuranFilterStatus] = useState<string>('all');

  // Dialog States
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusSending, setStatusSending] = useState(false);
  const [statusQuery, setStatusQuery] = useState<AdmissionQuery | null>(null);
  const [quranCustomNote, setQuranCustomNote] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingQuery, setDeletingQuery] = useState<AdmissionQuery | null>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<AdmissionQuery | null>(null);

  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch(API_ADMISSION);
      if (response.ok) {
        const data = await response.json();
        setQueries(
          data.sort(
            (a: AdmissionQuery, b: AdmissionQuery) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (error) {
      console.error('Error fetching admission queries:', error);
      toast.error('Error loading admission queries');
    } finally {
      setIsLoading(false);
    }
  };

  const isQuranQuery = (q: AdmissionQuery) => {
    return (
      q.queryType === 'online_quran' ||
      q.program?.toLowerCase().includes('quran') ||
      (q.admissionNo && q.admissionNo.startsWith('MQA-')) ||
      (q.class && q.class.toLowerCase().includes('quran'))
    );
  };

  // Split queries into school and quran
  const schoolQueries = useMemo(() => queries.filter((q) => !isQuranQuery(q)), [queries]);
  const quranQueries = useMemo(() => queries.filter((q) => isQuranQuery(q)), [queries]);

  // Filtered School Queries
  const getFilteredSchoolQueries = () => {
    let filtered = schoolQueries;
    if (schoolSearchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
          q.parentEmail?.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
          q.contact1?.includes(schoolSearchTerm) ||
          q.class?.toLowerCase().includes(schoolSearchTerm.toLowerCase())
      );
    }
    if (schoolFilterStatus !== 'all') {
      filtered = filtered.filter((q) => q.status === schoolFilterStatus);
    }
    return filtered;
  };

  // Filtered Quran Queries
  const getFilteredQuranQueries = () => {
    let filtered = quranQueries;
    if (quranSearchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.name.toLowerCase().includes(quranSearchTerm.toLowerCase()) ||
          q.parentEmail?.toLowerCase().includes(quranSearchTerm.toLowerCase()) ||
          q.contact1?.includes(quranSearchTerm) ||
          q.class?.toLowerCase().includes(quranSearchTerm.toLowerCase()) ||
          q.admissionNo?.toLowerCase().includes(quranSearchTerm.toLowerCase()) ||
          q.homeAddress?.toLowerCase().includes(quranSearchTerm.toLowerCase())
      );
    }
    if (quranFilterStatus !== 'all') {
      filtered = filtered.filter((q) => q.status === quranFilterStatus);
    }
    return filtered;
  };

  // Status Dialog Handlers
  const handleChangeStatus = (query: AdmissionQuery) => {
    setStatusQuery({ ...query });
    setQuranCustomNote('');
    setStatusDialogOpen(true);
  };

  const sendStatusEmail = async () => {
    if (!statusQuery) return;
    setStatusSending(true);

    try {
      const isQuran = isQuranQuery(statusQuery);
      const html = isQuran
        ? quranAdmissionStatusTemplate({
            name: statusQuery.name,
            course: statusQuery.class || 'Online Quran Course',
            status: statusQuery.status,
            admissionNo: statusQuery.admissionNo,
            customNote: quranCustomNote,
          })
        : admissionStatusTemplate({
            name: statusQuery.name,
            program: statusQuery.program,
            status: statusQuery.status as 'pending' | 'test_passed' | 'admitted' | 'contacted',
          });

      const subject = isQuran
        ? `Online Quran Academy — Trial Update [Ref: ${statusQuery.admissionNo || 'MQA'}]`
        : 'Admission Query Status Update — Meridian School';

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: statusQuery.parentEmail,
          subject,
          html,
        }),
      });

      // Update query status in database
      const updateRes = await fetch(`${API_ADMISSION}/${statusQuery._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusQuery.status }),
      });

      if (updateRes.ok) {
        setQueries(queries.map((q) => (q._id === statusQuery._id ? statusQuery : q)));
        if (res.ok) {
          toast.success('Status updated and notification email sent!');
        } else {
          toast.success('Status updated (email delivery failed)');
        }
        setStatusDialogOpen(false);
      } else {
        toast.error('Failed to update status in database');
      }
    } catch (err) {
      toast.error('Error updating status or sending email');
    } finally {
      setStatusSending(false);
    }
  };

  // Delete Handlers
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
        toast.success('Query deleted successfully');
        setDeleteConfirmOpen(false);
        setDeletingQuery(null);
      } else {
        toast.error('Failed to delete query');
      }
    } catch (error) {
      toast.error('Error deleting query');
    }
  };

  // View Details Dialog
  const handleViewDetails = (query: AdmissionQuery) => {
    setSelectedQuery(query);
    setReplyMessage('');
    setViewDialogOpen(true);
  };

  // Download Voucher
  const handleDownloadVoucher = async (query: AdmissionQuery) => {
    if (isDownloading) return;
    setIsDownloading(query._id);
    try {
      const vData = query.voucherData || {};
      await generateVoucherPDF({
        studentName: vData.studentName || query.name,
        fatherName: vData.fatherName || query.fatherName || 'N/A',
        fatherCNIC: vData.fatherCnic || query.fatherCnic || '',
        rollNumber: vData.rollNumber || '',
        studentClass: vData.studentClass || query.class,
        section: vData.shift || query.shift || '',
        sid: vData.sid || '',
        contact: vData.contact || query.contact1 || '',
        challanNo: vData.challanNo || '',
        billNo: vData.billNo || vData.voucherNumber?.split('-')[1] || '163802546',
        familyNo: vData.familyNo || 'N/A',
        dueDate: vData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        fees: vData.fees || [
          {
            month: 'Current',
            particular: 'Admission Fee',
            amount: vData.admissionFee || 0,
          },
          {
            month: 'Current',
            particular: 'Class Fee',
            amount: vData.classFees || 0,
          },
        ],
        totalAmount: vData.totalFee || query.feeAmount || 0,
        amountInWords: `PKR ${(vData.totalFee || query.feeAmount || 0).toLocaleString()} Only`,
        payableWithin: vData.payableWithin || vData.totalFee || query.feeAmount || 0,
        payableAfter: vData.payableAfter || (vData.totalFee || query.feeAmount || 0) + 500,
        motto: vData.motto || 'Building Confidence Through Expression',
        instructions: vData.instructions || 'Please submit the fee before the due date to confirm admission.',
        fileName: `voucher-${(vData.studentName || query.name).replace(/\s+/g, '-').toLowerCase()}.pdf`,
      });
      toast.success('Voucher downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download voucher');
    } finally {
      setIsDownloading(null);
    }
  };

  // Send Email Reply
  const handleSendReply = async () => {
    if (!selectedQuery || !replyMessage.trim()) return;
    setSendingReply(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedQuery.parentEmail,
          subject: isQuranQuery(selectedQuery)
            ? `Reply: Online Quran Academy Trial [${selectedQuery.admissionNo || 'MQA'}]`
            : 'Reply to your School Admission Query — Meridian School',
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <p>Dear <b>${selectedQuery.name}</b> / Respected Parent,</p>
            <p>${replyMessage.replace(/\n/g, '<br/>')}</p>
            <br/>
            <p>Best Regards,<br><b>Meridian Group of Education</b></p>
          </div>`,
        }),
      });

      if (res.ok) {
        toast.success('Reply sent successfully!');
        setReplyMessage('');
        setViewDialogOpen(false);
      } else {
        toast.error('Failed to send reply');
      }
    } catch (err) {
      toast.error('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Metrics for School
  const schoolPendingCount = schoolQueries.filter((q) => q.status === 'pending').length;
  const schoolTestPassedCount = schoolQueries.filter((q) => q.status === 'test_passed').length;
  const schoolAdmittedCount = schoolQueries.filter((q) => q.status === 'admitted').length;

  // Metrics for Quran
  const quranPendingCount = quranQueries.filter((q) => q.status === 'pending').length;
  const quranTrialScheduledCount = quranQueries.filter((q) => q.status === 'trial_scheduled').length;
  const quranEnrolledCount = quranQueries.filter((q) => q.status === 'enrolled').length;

  // School Columns
  const schoolColumns: DataTableColumn<AdmissionQuery>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Student',
        searchable: true,
        render: (row: AdmissionQuery) => (
          <div>
            <span className="font-semibold text-foreground block">{row.name}</span>
            {row.fatherName && (
              <span className="text-xs text-muted-foreground">S/D/O {row.fatherName}</span>
            )}
          </div>
        ),
      },
      {
        key: 'class',
        label: 'Class & Shift',
        render: (row: AdmissionQuery) => (
          <div>
            <span className="font-medium text-foreground block">{row.class || 'N/A'}</span>
            {row.shift && <span className="text-xs text-muted-foreground">{row.shift}</span>}
          </div>
        ),
      },
      {
        key: 'program',
        label: 'Program',
        render: (row: AdmissionQuery) => (
          <Badge variant="outline" className="font-medium">
            {row.program}
          </Badge>
        ),
      },
      {
        key: 'parentEmail',
        label: 'Contact Info',
        render: (row: AdmissionQuery) => (
          <div className="space-y-1 text-xs">
            <a
              href={`mailto:${row.parentEmail}`}
              className="text-primary hover:underline flex items-center gap-1 truncate max-w-[180px]"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {row.parentEmail}
            </a>
            <a
              href={`tel:${row.contact1}`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {row.contact1}
            </a>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (row: AdmissionQuery) => {
          const statusConfig: Record<string, { label: string; className: string }> = {
            pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
            test_passed: { label: 'Test Passed', className: 'bg-green-100 text-green-700' },
            admitted: { label: 'Admitted', className: 'bg-blue-100 text-blue-700' },
            contacted: { label: 'Contacted', className: 'bg-purple-100 text-purple-700' },
          };
          const config = statusConfig[row.status] || {
            label: row.status || 'Pending',
            className: 'bg-slate-100 text-slate-700',
          };
          return (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        key: 'voucher',
        label: 'Voucher',
        render: (row: AdmissionQuery) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadVoucher(row);
            }}
            disabled={isDownloading === row._id}
          >
            {isDownloading === row._id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Voucher
          </Button>
        ),
      },
    ],
    [isDownloading]
  );

  // School Actions
  const schoolActions: DataTableAction<AdmissionQuery>[] = useMemo(
    () => [
      {
        label: 'View Details',
        icon: <Eye className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleViewDetails(row),
        variant: 'outline',
      },
      {
        label: 'Change Status & Email',
        icon: <Edit className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleChangeStatus(row),
        variant: 'outline',
      },
      {
        label: 'Delete',
        icon: <Trash2 className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleDelete(row),
        variant: 'destructive',
      },
    ],
    []
  );

  // Online Quran Columns
  const quranColumns: DataTableColumn<AdmissionQuery>[] = useMemo(
    () => [
      {
        key: 'admissionNo',
        label: 'Reference',
        searchable: true,
        render: (row: AdmissionQuery) => (
          <span className="font-mono text-xs font-bold px-2 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-md">
            {row.admissionNo || 'MQA-Pending'}
          </span>
        ),
      },
      {
        key: 'name',
        label: 'Student',
        searchable: true,
        render: (row: AdmissionQuery) => (
          <div>
            <span className="font-semibold text-foreground block">{row.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {row.age && (
                <span className="text-[11px] font-medium text-slate-500">{row.age} yrs</span>
              )}
              {row.gender && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  {row.gender}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'class',
        label: 'Selected Course',
        render: (row: AdmissionQuery) => (
          <div>
            <span className="font-semibold text-xs text-teal-900 block">{row.class}</span>
            {row.quranLevel && (
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                Lvl: {row.quranLevel}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'homeAddress',
        label: 'Location',
        render: (row: AdmissionQuery) => (
          <div className="flex items-center gap-1 text-xs text-foreground">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[130px]">{row.homeAddress || 'N/A'}</span>
          </div>
        ),
      },
      {
        key: 'shift',
        label: 'Plan & Fee',
        render: (row: AdmissionQuery) => (
          <div className="text-xs">
            <span className="font-medium text-foreground block">
              {row.shift || (row.classesPerWeek ? `${row.classesPerWeek} Classes/Wk` : 'Flexible')}
            </span>
            <span className="text-teal-700 font-bold">
              {row.feeAmount
                ? `${row.currency === 'USD' ? '$' : 'PKR '}${row.feeAmount.toLocaleString()}/mo`
                : 'Free Trial'}
            </span>
          </div>
        ),
      },
      {
        key: 'preferredTutor',
        label: 'Tutor / Platform',
        render: (row: AdmissionQuery) => (
          <div className="text-xs text-muted-foreground">
            <span>{row.preferredTutor || 'Any'} Tutor</span>
            <span className="block text-[11px] font-semibold text-slate-600">
              via {row.preferredPlatform || 'Zoom'}
            </span>
          </div>
        ),
      },
      {
        key: 'contact1',
        label: 'Contact',
        render: (row: AdmissionQuery) => {
          const rawPhone = (row.contact1 || '').replace(/\D/g, '');
          const waLink = `https://wa.me/${rawPhone.startsWith('92') ? rawPhone : `92${rawPhone}`}?text=${encodeURIComponent(
            `Assalam-o-Alaikum ${row.name}! Regarding your Online Quran Academy trial request (Ref: ${row.admissionNo || 'MQA'}).`
          )}`;
          return (
            <div className="space-y-1 text-xs">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold rounded text-[11px] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                WhatsApp
              </a>
              <a
                href={`mailto:${row.parentEmail}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 truncate max-w-[140px]"
              >
                <Mail className="w-3 h-3 shrink-0" />
                {row.parentEmail}
              </a>
            </div>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        render: (row: AdmissionQuery) => {
          const statusConfig: Record<string, { label: string; className: string }> = {
            pending: { label: 'Pending Trial', className: 'bg-amber-100 text-amber-700' },
            contacted: { label: 'Contacted', className: 'bg-purple-100 text-purple-700' },
            trial_scheduled: { label: 'Trial Scheduled', className: 'bg-teal-100 text-teal-800 font-bold' },
            enrolled: { label: 'Enrolled', className: 'bg-green-100 text-green-800 font-bold' },
            cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
          };
          const config = statusConfig[row.status] || {
            label: row.status || 'Pending',
            className: 'bg-slate-100 text-slate-700',
          };
          return (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
              {config.label}
            </span>
          );
        },
      },
    ],
    []
  );

  // Online Quran Actions
  const quranActions: DataTableAction<AdmissionQuery>[] = useMemo(
    () => [
      {
        label: 'View Details',
        icon: <Eye className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleViewDetails(row),
        variant: 'outline',
      },
      {
        label: 'Update Status & Email',
        icon: <Edit className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleChangeStatus(row),
        variant: 'outline',
      },
      {
        label: 'Delete',
        icon: <Trash2 className="w-4 h-4" />,
        onClick: (row: AdmissionQuery) => handleDelete(row),
        variant: 'destructive',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Admission &amp; Enrollment Queries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage prospective student inquiries for Meridian School and Online Quran Academy.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'school' | 'online_quran')}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/80 rounded-xl h-11">
          <TabsTrigger
            value="school"
            className="flex items-center justify-center gap-2 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
          >
            <GraduationCap className="w-4 h-4" />
            School Inquiries
            <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 font-bold">
              {schoolQueries.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="online_quran"
            className="flex items-center justify-center gap-2 font-bold data-[state=active]:bg-teal-700 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg"
          >
            <BookOpen className="w-4 h-4" />
            Online Quran
            <Badge
              variant="secondary"
              className="ml-1.5 text-xs px-1.5 py-0 font-bold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
            >
              {quranQueries.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ---------------- TAB 1: SCHOOL INQUIRIES ---------------- */}
        <TabsContent value="school" className="space-y-6 mt-6">
          {/* School Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Total Inquiries</span>
              <p className="text-2xl font-bold text-foreground mt-1">{schoolQueries.length}</p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-amber-600">Pending Tests</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{schoolPendingCount}</p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-green-600">Passed Tests</span>
              <p className="text-2xl font-bold text-green-600 mt-1">{schoolTestPassedCount}</p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-blue-600">Admitted</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{schoolAdmittedCount}</p>
            </div>
          </div>

          {/* School Status Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-bold text-muted-foreground mr-1">Filter by:</span>
            {['all', 'pending', 'test_passed', 'admitted', 'contacted'].map((status) => (
              <Button
                key={status}
                variant={schoolFilterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSchoolFilterStatus(status)}
                className={`rounded-full text-xs cursor-pointer ${
                  schoolFilterStatus === status
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'border-slate-200 text-muted-foreground hover:text-foreground'
                }`}
              >
                {status === 'all'
                  ? 'All Queries'
                  : status === 'pending'
                  ? 'Pending'
                  : status === 'test_passed'
                  ? 'Test Passed'
                  : status === 'admitted'
                  ? 'Admitted'
                  : 'Contacted'}
              </Button>
            ))}
          </div>

          {/* School Table */}
          <DataTable
            data={getFilteredSchoolQueries()}
            columns={schoolColumns}
            actions={schoolActions}
            searchPlaceholder="Search school inquiries by student, email, phone, class..."
            rowKey="_id"
            initialPageSize={10}
          />
        </TabsContent>

        {/* ---------------- TAB 2: ONLINE QURAN INQUIRIES ---------------- */}
        <TabsContent value="online_quran" className="space-y-6 mt-6">
          {/* Quran Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                Total Quran Queries
              </span>
              <p className="text-2xl font-extrabold text-teal-900 dark:text-teal-100 mt-1">
                {quranQueries.length}
              </p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-amber-600">Pending Trials</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{quranPendingCount}</p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-teal-600">Trial Scheduled</span>
              <p className="text-2xl font-bold text-teal-600 mt-1">{quranTrialScheduledCount}</p>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-green-600">Enrolled Students</span>
              <p className="text-2xl font-bold text-green-600 mt-1">{quranEnrolledCount}</p>
            </div>
          </div>

          {/* Quran Status Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-bold text-muted-foreground mr-1">Status:</span>
            {['all', 'pending', 'contacted', 'trial_scheduled', 'enrolled', 'cancelled'].map(
              (status) => (
                <Button
                  key={status}
                  variant={quranFilterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuranFilterStatus(status)}
                  className={`rounded-full text-xs cursor-pointer ${
                    quranFilterStatus === status
                      ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                      : 'border-slate-200 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status === 'all'
                    ? 'All Quran Queries'
                    : status === 'pending'
                    ? 'Pending Trial'
                    : status === 'contacted'
                    ? 'Contacted'
                    : status === 'trial_scheduled'
                    ? 'Trial Scheduled'
                    : status === 'enrolled'
                    ? 'Enrolled'
                    : 'Cancelled'}
                </Button>
              )
            )}
          </div>

          {/* Quran Table */}
          <DataTable
            data={getFilteredQuranQueries()}
            columns={quranColumns}
            actions={quranActions}
            searchPlaceholder="Search Quran trials by student, ref, course, location, phone..."
            rowKey="_id"
            initialPageSize={10}
          />
        </TabsContent>
      </Tabs>

      {/* ---------------- CHANGE STATUS & EMAIL DIALOG ---------------- */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {statusQuery && isQuranQuery(statusQuery) ? (
                <>
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  Update Quran Trial Status &amp; Email
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Update School Admission Status
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {statusQuery && (
            <div className="space-y-5 py-2">
              {/* Inquiry Summary Box */}
              <div className="bg-muted/50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <b className="text-foreground">{statusQuery.name}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground font-mono">{statusQuery.parentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course / Program:</span>
                  <span className="text-foreground font-medium">
                    {statusQuery.class || statusQuery.program}
                  </span>
                </div>
                {statusQuery.admissionNo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="text-teal-700 font-mono font-bold">
                      {statusQuery.admissionNo}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Select New Status</label>
                {isQuranQuery(statusQuery) ? (
                  <select
                    value={statusQuery.status}
                    onChange={(e) => setStatusQuery({ ...statusQuery, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pending">Pending Trial (Under Review)</option>
                    <option value="contacted">Contacted (WhatsApp/Call Done)</option>
                    <option value="trial_scheduled">Trial Scheduled (Class Confirmed)</option>
                    <option value="enrolled">Enrolled (Official Student)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <select
                    value={statusQuery.status}
                    onChange={(e) => setStatusQuery({ ...statusQuery, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending (Test Required)</option>
                    <option value="test_passed">Test Passed</option>
                    <option value="admitted">Admitted (Seat Confirmed)</option>
                    <option value="contacted">Contacted</option>
                  </select>
                )}
              </div>

              {/* Optional Teacher / Coordinator Note for Quran */}
              {isQuranQuery(statusQuery) && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">
                    Teacher Coordinator Note / Meeting Link{' '}
                    <span className="text-muted-foreground font-normal">(Included in Email)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={quranCustomNote}
                    onChange={(e) => setQuranCustomNote(e.target.value)}
                    placeholder="e.g. Trial scheduled for Tuesday 5:00 PM PKT. Zoom link: https://zoom.us/j/... Teacher: Ustaad Ahmad"
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={statusSending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={sendStatusEmail}
              disabled={statusSending}
              className="bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
            >
              {statusSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating &amp; Sending Email...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1.5" />
                  Save Status &amp; Notify
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- VIEW DETAILS DIALOG ---------------- */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              {selectedQuery && isQuranQuery(selectedQuery) ? (
                <>
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  Online Quran Application Details
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 text-primary" />
                  School Admission Query Details
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedQuery && (
            <div className="space-y-6 py-2">
              {/* Top Banner */}
              <div className="bg-muted/40 p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-foreground">{selectedQuery.name}</h2>
                    {selectedQuery.gender && (
                      <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-700">
                        {selectedQuery.gender}
                      </span>
                    )}
                    {selectedQuery.age && (
                      <span className="text-xs text-muted-foreground font-semibold">
                        ({selectedQuery.age} years old)
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-teal-800 mt-1">
                    {selectedQuery.class || selectedQuery.program}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  {selectedQuery.admissionNo && (
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-md block w-fit ml-auto">
                      REF: {selectedQuery.admissionNo}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground block">
                    Received: {new Date(selectedQuery.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Online Quran Specific Details */}
              {isQuranQuery(selectedQuery) ? (
                <div className="space-y-6">
                  {/* 1. Academic & Learning Preferences */}
                  <div>
                    <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      Course &amp; Learning Preferences
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-background p-4 rounded-xl border text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-1">Quran Reading Level</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.quranLevel || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Study Frequency</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.shift ||
                            (selectedQuery.classesPerWeek
                              ? `${selectedQuery.classesPerWeek} Classes / Week`
                              : '3 Classes / Week')}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Estimated Monthly Fee</span>
                        <p className="font-bold text-teal-700 text-sm">
                          {selectedQuery.feeAmount
                            ? `${selectedQuery.currency === 'USD' ? '$' : 'PKR '}${selectedQuery.feeAmount.toLocaleString()}/mo`
                            : 'Standard Plan'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Preferred Tutor</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.preferredTutor || 'No preference'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Platform</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.preferredPlatform || 'Zoom'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Preferred Time / Zone</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.preferredTime || 'Flexible'}{' '}
                          {selectedQuery.timezone ? `(${selectedQuery.timezone})` : ''}
                        </p>
                      </div>
                      {selectedQuery.preferredDays && selectedQuery.preferredDays.length > 0 && (
                        <div className="sm:col-span-3">
                          <span className="text-muted-foreground block mb-1.5">Preferred Days</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedQuery.preferredDays.map((d, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-800 rounded font-bold text-[11px]"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Guardian & Contact Info */}
                  <div>
                    <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-teal-600" />
                      Guardian &amp; Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background p-4 rounded-xl border text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-1">Parent / Guardian</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.fatherName || 'Student Self'}{' '}
                          {selectedQuery.relation ? `(${selectedQuery.relation})` : ''}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Location / City</span>
                        <p className="font-semibold text-foreground">
                          {selectedQuery.homeAddress || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">WhatsApp Number</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono font-bold text-foreground">
                            {selectedQuery.contact1}
                          </span>
                          <a
                            href={`https://wa.me/${(selectedQuery.contact1 || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Assalam-o-Alaikum ${selectedQuery.name}! Regarding your Online Quran Academy trial (Ref: ${selectedQuery.admissionNo}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Open Chat
                          </a>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Email Address</span>
                        <a
                          href={`mailto:${selectedQuery.parentEmail}`}
                          className="text-primary font-medium hover:underline flex items-center gap-1 mt-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {selectedQuery.parentEmail}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 3. Notes */}
                  {selectedQuery.message && (
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs">
                      <span className="font-bold text-amber-900 block mb-1">Additional Notes from Applicant:</span>
                      <p className="text-amber-950 leading-relaxed">{selectedQuery.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* School Specific Details */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                      Personal &amp; Academic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background p-4 rounded-xl border text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-1">Class</span>
                        <p className="font-semibold text-foreground">{selectedQuery.class || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Shift</span>
                        <p className="font-semibold text-foreground">{selectedQuery.shift || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Date of Birth</span>
                        <p className="font-semibold text-foreground">{selectedQuery.dob || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Father's Name</span>
                        <p className="font-semibold text-foreground">{selectedQuery.fatherName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Father's CNIC</span>
                        <p className="font-semibold text-foreground font-mono">{selectedQuery.fatherCnic || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Home Address</span>
                        <p className="font-semibold text-foreground">{selectedQuery.homeAddress || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Test Details */}
                  {selectedQuery.testCompleted && selectedQuery.testDetails && (
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                        Admission Test Results
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-background border p-3 rounded-xl text-center">
                          <span className="text-xs text-muted-foreground">Total Marks</span>
                          <p className="text-xl font-bold text-foreground mt-1">
                            {selectedQuery.testDetails.totalMarks}
                          </p>
                        </div>
                        <div className="bg-background border p-3 rounded-xl text-center">
                          <span className="text-xs text-muted-foreground">Passing Marks</span>
                          <p className="text-xl font-bold text-amber-600 mt-1">
                            {selectedQuery.testDetails.passingMarks}
                          </p>
                        </div>
                        <div className="bg-background border p-3 rounded-xl text-center">
                          <span className="text-xs text-muted-foreground">Obtained</span>
                          <p
                            className={`text-xl font-bold mt-1 ${
                              selectedQuery.testPassed ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {selectedQuery.testScore ?? 0}
                          </p>
                        </div>
                        <div className="bg-background border p-3 rounded-xl text-center">
                          <span className="text-xs text-muted-foreground">Percentage</span>
                          <p
                            className={`text-xl font-bold mt-1 ${
                              selectedQuery.testPassed ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {selectedQuery.testDetails.percentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {selectedQuery.documents && selectedQuery.documents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                        Uploaded Documents
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedQuery.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-muted/40 border rounded-xl text-xs"
                          >
                            <span className="font-medium truncate max-w-[200px]">{doc.name}</span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary font-bold hover:underline flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Reply Form */}
              <div className="pt-4 border-t space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Send Direct Email Response to {selectedQuery.parentEmail}
                </h4>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message here..."
                  className="w-full px-3 py-2 text-sm bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    size="sm"
                    className="gap-1.5 cursor-pointer"
                  >
                    {sendingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admission Query"
        description={`Are you sure you want to delete the query for "${deletingQuery?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
