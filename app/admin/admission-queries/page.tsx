'use client';



import { useEffect, useState, useRef } from 'react';

import { Button } from '@/components/ui/button';

import { Phone, Mail, Trash2, CheckCircle, Circle, Edit, Eye, Loader2, FileText } from 'lucide-react';

import VoucherTemplate from '@/components/voucher/VoucherTemplate';

import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';

import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

import { admissionStatusTemplate } from '@/lib/emailTemplates';

import { toast } from 'sonner';

import { AdmissionQuery } from '@/lib/types';

import { API_ADMISSION } from '@/lib/api/endpoints';



export default function AdmissionQueriesPage() {

  const [queries, setQueries] = useState<AdmissionQuery[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'test_passed' | 'admitted' | 'contacted'>('all');

  const [isLoading, setIsLoading] = useState(true);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [statusSending, setStatusSending] = useState(false);

  const [statusQuery, setStatusQuery] = useState<AdmissionQuery | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [deletingQuery, setDeletingQuery] = useState<AdmissionQuery | null>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState<AdmissionQuery | null>(null);

  const [replyMessage, setReplyMessage] = useState('');

  const [sendingReply, setSendingReply] = useState(false);

  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);

  const [voucherQuery, setVoucherQuery] = useState<AdmissionQuery | null>(null);

  const voucherRef = useRef<HTMLDivElement>(null);

  console.log(voucherQuery)

  useEffect(() => {

    fetchQueries();

  }, []);



  const getFilteredQueries = () => {

    let filtered = queries;

    if (searchTerm) {

      filtered = filtered.filter((q) =>

        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

        q.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||

        q.contact1?.includes(searchTerm)

      );

    }

    if (filterStatus !== 'all') {

      filtered = filtered.filter((q) => q.status === filterStatus);

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



  const handleChangeStatus = (id: string) => {

    const query = queries.find(q => q._id === id);

    if (!query) return;

    setStatusQuery({ ...query });

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

          to: statusQuery.parentEmail,

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



  const handleViewDetails = (query: AdmissionQuery) => {

    setSelectedQuery(query);

    setReplyMessage('');

    setViewDialogOpen(true);

  };

  const handleGenerateVoucher = (query: AdmissionQuery) => {

    setVoucherQuery(query);

    setVoucherDialogOpen(true);

  };

  // Send reply message to parent

  const handleSendReply = async () => {

    if (!selectedQuery || !replyMessage.trim()) return;

    setSendingReply(true);

    try {

      const res = await fetch('/api/send-email', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          to: selectedQuery.parentEmail,

          subject: 'Reply to your Admission Query',

          html: `<p>${replyMessage.replace(/\n/g, '<br/>')}</p>`

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

  const testPassedCount = queries.filter((q) => q.status === 'test_passed').length;

  const admittedCount = queries.filter((q) => q.status === 'admitted').length;



  const columns: DataTableColumn<AdmissionQuery>[] = [

    {

      key: 'name',

      label: 'Name',

      searchable: true,

      render: (row: AdmissionQuery) => <span className="font-semibold text-foreground">{row.name}</span>,

    },

    {

      key: 'parentEmail',

      label: 'Email',

      render: (row: AdmissionQuery) => <a href={`mailto:${row.parentEmail}`} className="text-primary hover:underline flex items-center gap-1"><Mail className="w-4 h-4" />{row.parentEmail}</a>,

    },

    {

      key: 'contact1',

      label: 'Phone',

      render: (row: AdmissionQuery) => <a href={`tel:${row.contact1}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="w-4 h-4" />{row.contact1}</a>,

    },

    {

      key: 'program',

      label: 'Program',

      render: (row: AdmissionQuery) => <span>{row.program}</span>,

    },

    {

      key: 'status',

      label: 'Status',

      render: (row: AdmissionQuery) => {

        const statusConfig = {

          pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },

          test_passed: { label: 'Test Passed', className: 'bg-green-100 text-green-700' },

          admitted: { label: 'Admitted', className: 'bg-blue-100 text-blue-700' },

          contacted: { label: 'Contacted', className: 'bg-purple-100 text-purple-700' },

        };

        const config = statusConfig[row.status as keyof typeof statusConfig] || statusConfig.pending;

        return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.className}`}>{config.label}</span>;

      },

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

      label: 'View Details',

      icon: <Eye className="w-4 h-4" />,

      onClick: (row: AdmissionQuery) => handleViewDetails(row),

      variant: 'outline',

    },

    {

      label: 'Generate Voucher',

      icon: <FileText className="w-4 h-4" />,

      onClick: (row: AdmissionQuery) => handleGenerateVoucher(row),

      variant: 'outline',

    },

    {

      label: 'Change Status & Email',

      icon: <Edit className="w-4 h-4" />,

      onClick: (row: AdmissionQuery) => handleChangeStatus(row._id),

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

          {pendingCount} pending • {testPassedCount} test passed • {admittedCount} admitted

        </p>

      </div>

      <div className="mb-4 flex gap-2 flex-wrap">

        {(['all', 'pending', 'test_passed', 'admitted', 'contacted'] as const).map((status) => (

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

            {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : status === 'test_passed' ? 'Test Passed' : status === 'admitted' ? 'Admitted' : 'Contacted'}

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

                <p className="font-semibold text-foreground">{statusQuery?.parentEmail}</p>

              </div>

              {/* <div className="space-y-2">

                <p className="text-sm text-muted-foreground">Program</p>

                <p className="font-semibold text-foreground">{statusQuery?.program}</p>

              </div> */}

              <div className="space-y-2">

                <p className="text-sm text-muted-foreground">Current Status</p>

                <p className={`font-semibold px-2 py-1 rounded w-fit ${

                  statusQuery?.status === 'test_passed' ? 'bg-green-100 text-green-700' :

                  statusQuery?.status === 'admitted' ? 'bg-blue-100 text-blue-700' :

                  statusQuery?.status === 'contacted' ? 'bg-purple-100 text-purple-700' :

                  'bg-amber-100 text-amber-700'

                }`}>

                  {statusQuery?.status === 'pending' ? 'Pending' :

                   statusQuery?.status === 'test_passed' ? 'Test Passed' :

                   statusQuery?.status === 'admitted' ? 'Admitted' :

                   statusQuery?.status === 'contacted' ? 'Contacted' : 'Pending'}

                </p>

              </div>

            </div>

            <div className="space-y-2">

              <p className="text-sm font-semibold text-foreground">Status Update</p>

              <div className="border rounded p-4 bg-muted/10 max-h-64 overflow-y-auto text-sm">

                <p className="text-muted-foreground">

                  An email will be sent to <strong>{statusQuery?.parentEmail}</strong> regarding the status update for <strong>{statusQuery?.name}</strong> admission query for <strong>{statusQuery?.program}</strong>.

                </p>

                <p className="mt-2 text-xs text-muted-foreground">

                  Current Status: <span className={`font-semibold ${

                    statusQuery?.status === 'test_passed' ? 'text-green-700' :

                    statusQuery?.status === 'admitted' ? 'text-blue-700' :

                    statusQuery?.status === 'contacted' ? 'text-purple-700' :

                    'text-amber-700'

                  }`}>{

                    statusQuery?.status === 'pending' ? 'Pending' :

                    statusQuery?.status === 'test_passed' ? 'Test Passed' :

                    statusQuery?.status === 'admitted' ? 'Admitted' :

                    statusQuery?.status === 'contacted' ? 'Contacted' : 'Pending'

                  }</span>

                </p>

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

      {/* Voucher Dialog */}

      <Dialog open={voucherDialogOpen} onOpenChange={setVoucherDialogOpen}>

        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">

          <DialogHeader>

            <DialogTitle>Student Voucher</DialogTitle>

          </DialogHeader>

          {voucherQuery && (

            <div className="space-y-4">

              <div ref={voucherRef}>

                <VoucherTemplate

                  studentName={voucherQuery.name}

                  fatherName={voucherQuery.fatherName || 'N/A'}

                  fatherCNIC={voucherQuery.fatherCnic}

                  class={voucherQuery.class}

                  section={voucherQuery.voucherData?.shift}

                  contact={voucherQuery.contact1}

                  testScore={voucherQuery.testScore}

                  totalMarks={voucherQuery.testDetails?.totalMarks}

                  percentage={voucherQuery.testDetails?.percentage}

                  dueDate={voucherQuery.voucherData?.dueDate || new Date().toISOString().split('T')[0]}

                  challanNo={voucherQuery.voucherData?.challanNo}

                  admissionNo={voucherQuery.voucherData?.admissionNo || voucherQuery._id?.slice(-6).toUpperCase()}

                  familyNo={voucherQuery.voucherData?.familyNo || 'N/A'}

                  fees={voucherQuery.voucherData?.fees || [

                    { month: 'Current', particular: 'Admission Fee', amount: voucherQuery.voucherData.admissionFee
 || 0},

                    { month: 'Current', particular: 'Class Fee', amount: voucherQuery.voucherData?.classFees || 0}

                  ]}

                  totalAmount={voucherQuery.voucherData?.totalFee }

                  amountInWords={`PKR ${voucherQuery.voucherData?.totalFee} Only`}

                  payableWithin={voucherQuery.voucherData?.payableWithin}

                  payableAfter={voucherQuery.voucherData?.payableAfter || (voucherQuery.feeAmount || 0) + ((voucherQuery.feeAmount || 0) * 0.05)}

                  motto="Excellence in Education"

                  instructions="Please deposit fee within the stipulated time."

                  showDownloadButton={true}

                  fileName={`voucher-${voucherQuery.name.replace(/\s+/g, '-').toLowerCase()}.pdf`}

                />

              </div>

            </div>

          )}

          <DialogFooter>

            <Button variant="outline" onClick={() => setVoucherDialogOpen(false)}>

              Close

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>



      {/* View Details Dialog with reply option */}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>

        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh]">

          <DialogHeader>

            <DialogTitle>Admission Query Details</DialogTitle>

          </DialogHeader>

          {selectedQuery ? (

            <div className="space-y-8 py-4">

              {/* Header Summary */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/50 p-6 rounded-xl">

                <div className="space-y-2">

                  <span className="text-sm font-medium text-muted-foreground">Student Name</span>

                  <h2 className="text-2xl font-bold text-foreground">{selectedQuery.name}</h2>

                </div>

                <div className="space-y-2">

                  <span className="text-sm font-medium text-muted-foreground">Program</span>

                  <p className="text-xl font-semibold text-foreground">{selectedQuery.program}</p>

                </div>

                <div className="space-y-2">

                  <span className="text-sm font-medium text-muted-foreground">Status</span>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${

                    selectedQuery.status === 'test_passed' ? 'bg-green-100 text-green-800' :

                    selectedQuery.status === 'admitted' ? 'bg-blue-100 text-blue-800' :

                    selectedQuery.status === 'contacted' ? 'bg-purple-100 text-purple-800' :

                    'bg-amber-100 text-amber-800'

                  }`}>{selectedQuery.status.toUpperCase()}</span>

                  <p className="text-sm text-muted-foreground">Submitted {new Date(selectedQuery.createdAt).toLocaleDateString()}</p>

                </div>

              </div>



              {/* Personal Information */}

              <div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>👤</span> Personal Information</h3>

                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Class</dt><dd className="text-foreground font-medium">{selectedQuery.class || 'N/A'}</dd></div>

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</dt><dd className="text-foreground font-medium">{selectedQuery.dob || 'N/A'}</dd></div>

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Father's Name</dt><dd className="text-foreground font-medium">{selectedQuery.fatherName || 'N/A'}</dd></div>

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Father's CNIC</dt><dd className="text-foreground font-medium">{selectedQuery.fatherCnic || 'N/A'}</dd></div>

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Shift</dt><dd className="text-foreground font-medium">{selectedQuery.shift || 'N/A'}</dd></div>

                </dl>

              </div>



              {/* Contact Information */}

              <div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>📱</span> Contact Information</h3>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Father's Contact</dt><dd className="text-foreground font-medium"><a href={`tel:${selectedQuery.contact1}`} className="hover:underline">{selectedQuery.contact1}</a></dd></div>

                  <div><dt className="text-sm font-medium text-muted-foreground mb-1">Parent Email</dt><dd className="text-foreground font-medium"><a href={`mailto:${selectedQuery.parentEmail}`} className="hover:underline">{selectedQuery.parentEmail}</a></dd></div>

                  <div className="md:col-span-2"><dt className="text-sm font-medium text-muted-foreground mb-1">Home Address</dt><dd className="text-foreground font-medium">{selectedQuery.homeAddress || 'N/A'}</dd></div>

                </dl>

              </div>



              {/* Documents */}

              {selectedQuery.documents && selectedQuery.documents.length > 0 && (

                <div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>📄</span> Uploaded Documents</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {selectedQuery.documents.map((doc, index) => (

                      <div key={doc.publicId} className="bg-muted/30 p-4 rounded-xl border border-primary/10">

                        <div className="flex items-start gap-3">

                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">

                            <span className="text-lg">{doc.type.includes('pdf') ? '📕' : '🖼️'}</span>

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>

                            <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</p>

                            <a 

                              href={doc.url} 

                              target="_blank" 

                              rel="noopener noreferrer"

                              className="text-xs text-primary hover:underline mt-1 inline-block"

                            >

                              View Document →

                            </a>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )}



              {/* Test Status */}

              {selectedQuery.testCompleted && (

                <div className="bg-muted/30 p-6 rounded-xl border border-primary/10">

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>📝</span> Test Status</h3>

                  

                  {/* Test Summary Cards */}

                  {selectedQuery.testCompleted && selectedQuery.testDetails && (

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                      <div className="bg-white/60 p-4 rounded-xl border border-primary/10">

                        <dt className="text-xs font-medium text-muted-foreground mb-1">Total Marks</dt>

                        <dd className="text-2xl font-bold text-foreground">{selectedQuery.testDetails.totalMarks}</dd>

                      </div>

                      <div className="bg-white/60 p-4 rounded-xl border border-primary/10">

                        <dt className="text-xs font-medium text-muted-foreground mb-1">Passing Marks</dt>

                        <dd className="text-2xl font-bold text-amber-600">{selectedQuery.testDetails.passingMarks}</dd>

                      </div>

                      <div className="bg-white/60 p-4 rounded-xl border border-primary/10">

                        <dt className="text-xs font-medium text-muted-foreground mb-1">Obtained</dt>

                        <dd className={`text-2xl font-bold ${selectedQuery.testPassed ? 'text-green-600' : 'text-red-600'}`}>

                          {selectedQuery.testScore ?? 0}

                        </dd>

                      </div>

                      <div className="bg-white/60 p-4 rounded-xl border border-primary/10">

                        <dt className="text-xs font-medium text-muted-foreground mb-1">Percentage</dt>

                        <dd className={`text-2xl font-bold ${selectedQuery.testPassed ? 'text-green-600' : 'text-red-600'}`}>

                          {selectedQuery.testDetails.percentage}%

                        </dd>

                      </div>

                    </div>

                  )}



                  {/* Answer Breakdown */}

                  {selectedQuery.testCompleted && selectedQuery.testDetails && (

                    <div className="grid grid-cols-3 gap-4 mb-6">

                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">

                            <span className="text-green-600 font-bold">✓</span>

                          </div>

                          <div>

                            <dt className="text-xs font-medium text-green-700">Correct</dt>

                            <dd className="text-lg font-bold text-green-800">{selectedQuery.testDetails.correctAnswers}</dd>

                          </div>

                        </div>

                      </div>

                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">

                            <span className="text-red-600 font-bold">✗</span>

                          </div>

                          <div>

                            <dt className="text-xs font-medium text-red-700">Wrong</dt>

                            <dd className="text-lg font-bold text-red-800">{selectedQuery.testDetails.wrongAnswers}</dd>

                          </div>

                        </div>

                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">

                            <span className="text-amber-600 font-bold">-</span>

                          </div>

                          <div>

                            <dt className="text-xs font-medium text-amber-700">Unattempted</dt>

                            <dd className="text-lg font-bold text-amber-800">{selectedQuery.testDetails.unattempted}</dd>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}



                  {/* Result Badge */}

                  {selectedQuery.testPassed !== undefined && (

                    <div className="flex items-center gap-3 mb-4">

                      <span className="text-sm font-medium text-muted-foreground">Final Result:</span>

                      <span className={`font-bold px-4 py-1.5 rounded-full text-sm ${selectedQuery.testPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

                        {selectedQuery.testPassed ? '✅ PASSED' : '❌ FAILED'}

                      </span>

                      {selectedQuery.testCompletedAt && (

                        <span className="text-xs text-muted-foreground">

                          Completed on {new Date(selectedQuery.testCompletedAt).toLocaleString()}

                        </span>

                      )}

                    </div>

                  )}



                  {/* Question-wise Breakdown */}

                  {selectedQuery.testAnswers && selectedQuery.testAnswers.length > 0 && (

                    <div className="mt-6">

                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Question-wise Results</h4>

                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">

                        {selectedQuery.testAnswers.map((answer, idx) => (

                          <div

                            key={idx}

                            className={`p-2 rounded-lg text-center text-xs font-medium ${

                              answer.isCorrect

                                ? 'bg-green-100 text-green-800 border border-green-300'

                                : answer.selectedOption === -1

                                ? 'bg-amber-100 text-amber-800 border border-amber-300'

                                : 'bg-red-100 text-red-800 border border-red-300'

                            }`}

                            title={`Q${answer.questionIndex + 1}: Selected ${String.fromCharCode(65 + answer.selectedOption)}${answer.selectedOption === -1 ? ' (Not attempted)' : ''}, Correct ${String.fromCharCode(65 + answer.correctOption)}`}

                          >

                            <div className="text-[10px] text-muted-foreground">Q{answer.questionIndex + 1}</div>

                            <div className="font-bold">{answer.isCorrect ? '✓' : answer.selectedOption === -1 ? '-' : '✗'}</div>

                          </div>

                        ))}

                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">

                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div> Correct</div>

                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div> Wrong</div>

                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div> Unattempted</div>

                      </div>

                    </div>

                  )}



                </div>

              )}



              {/* Fee/Bank Slip Status */}

              {selectedQuery.bankSlipGenerated && (

                <div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>💰</span> Fee Status</h3>

                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                      <dt className="text-sm font-medium text-muted-foreground mb-1">Fee Amount</dt>

                      <dd className="text-foreground font-medium">PKR {selectedQuery.feeAmount?.toLocaleString() || 'N/A'}</dd>

                    </div>

                    {selectedQuery.bankSlipUrl && (

                      <div>

                        <dt className="text-sm font-medium text-muted-foreground mb-1">Bank Slip</dt>

                        <dd>

                          <a href={selectedQuery.bankSlipUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">

                            View Slip →

                          </a>

                        </dd>

                      </div>

                    )}

                  </dl>

                </div>

              )}



              {/* Message */}

              {selectedQuery.message && (

                <div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>💬</span> Additional Message</h3>

                  <div className="bg-muted/20 p-6 rounded-xl border-l-4 border-primary/30">

                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{selectedQuery.message}</p>

                  </div>

                </div>

              )}



              {/* Reply Message Box */}

              <div>

                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><span>✉️</span> Write a Reply</h3>

                <textarea

                  className="w-full min-h-[100px] border rounded p-2 text-foreground bg-background focus:outline-primary"

                  placeholder="Write your reply message here..."

                  value={replyMessage}

                  onChange={e => setReplyMessage(e.target.value)}

                  disabled={sendingReply}

                />

              </div>

            </div>

          ) : (

            <div>

              <p className="text-muted-foreground text-center py-8">Loading details...</p>

            </div>

          )}

          <DialogFooter className="gap-2">

            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>

              Close

            </Button>

            <Button onClick={handleSendReply} disabled={sendingReply || !replyMessage.trim()}>

              {sendingReply ? 'Sending...' : 'Send Reply'}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>

  );

}





