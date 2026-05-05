'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoucherTemplateProps } from '@/lib/types/voucher';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const VoucherTemplate = React.forwardRef<HTMLDivElement, VoucherTemplateProps>(({
  studentName,
  fatherName,
  fatherCNIC,
  rollNumber,
  class: studentClass,
  section ,
  testScore,
  totalMarks,
  percentage,
  testDate,
  testTitle,
  sid,
  contact,
  admissionNo,
  challanNo,
  familyNo,
  dueDate,
  fees,
  totalAmount,
  amountInWords,
  payableWithin,
  payableAfter,
  motto,
  instructions,
  showDownloadButton,
  fileName,
}, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const voucherRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // older version
  // const handleDownload = async () => {
  //   if (!voucherRef.current) {
  //     toast.error("Voucher not ready for download");
  //     return;
  //   }

  //   let container: HTMLDivElement | null = null;
  //   try {
  //     const html2pdf = (await import('html2pdf.js')).default;
  //     const clonedNode = voucherRef.current.cloneNode(true) as HTMLElement;
  //     clonedNode.style.width = '210mm';
  //     clonedNode.style.boxSizing = 'border-box';
  //     clonedNode.style.margin = '0';
  //     clonedNode.style.padding = '0';
  //     clonedNode.style.transform = 'scale(1)';
  //     clonedNode.style.transformOrigin = 'top left';

  //     container = document.createElement('div');
  //     container.style.position = 'fixed';
  //     container.style.left = '-10000px';
  //     container.style.top = '0';
  //     container.style.visibility = 'hidden';
  //     container.appendChild(clonedNode);
  //     document.body.appendChild(container);

  //     await new Promise((resolve) => setTimeout(resolve, 200));

  //     const opt = {
  //       margin: 0,
  //       filename: fileName || `fee-voucher-${studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
  //       image: { type: 'png' as const, quality: 1 },
  //       html2canvas: {
  //         scale: 3,
  //         useCORS: true,
  //         backgroundColor: '#ffffff',
  //         letterRendering: true,
  //         logging: false,
  //       },
  //       jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  //     };

  //     await html2pdf().set(opt).from(clonedNode).save();
  //     toast.success("Voucher downloaded successfully!");
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error downloading voucher:', error);
  //     toast.error("Failed to download voucher. Please try again.");
  //   } finally {
  //     if (container && container.parentNode) {
  //       container.parentNode.removeChild(container);
  //     }
  //   }
  // };

  // modify this to use the new version
  const handleDownload = async () => {
  if (!voucherRef.current || isDownloading) return;
  setIsDownloading(true);

  let container = null;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const original = voucherRef.current;
    const clone = original.cloneNode(true) as HTMLElement;

    // Reset all styles for clean A4 print
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.backgroundColor = '#fff';
    clone.style.boxSizing = 'border-box';
    clone.style.fontFamily = 'Arial, sans-serif';

    // Force all inner elements to use proper box-sizing
    clone.querySelectorAll('*').forEach((el) => {
      (el as HTMLElement).style.boxSizing = 'border-box';
    });

    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.appendChild(clone);
    document.body.appendChild(container);

    await new Promise(resolve => setTimeout(resolve, 300));

    const opt = {
      margin: [0, 0, 0, 0] as [number, number, number, number],
      filename: fileName || `fee-voucher-${studentName.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'png' as const, quality: 1 },
      html2canvas: {
        scale: 4,            // higher scale for crisp text
        useCORS: true,
        backgroundColor: '#ffffff',
        letterRendering: true,
        logging: false,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4' as const,
        orientation: 'portrait' as const
      }
    };

    await html2pdf().set(opt).from(clone).save();
    toast.success("Download successful!");
    router.push('/');
  } catch (error) {
    console.error(error);
    toast.error("Download failed");
    router.push('/');
  } finally {
    if (container?.parentNode) container.parentNode.removeChild(container);
    setIsDownloading(false);
  }
};

  const printDate = new Date().toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).replace(/ /g, '-');

  const displayAmountInWords = amountInWords || (typeof totalAmount === 'number'
    ? `PKR ${totalAmount.toLocaleString()} Only`
    : '');

  const copies = ['Student Copy', 'Office Copy', 'Bank Copy'];

  // ── shared inline styles ──────────────────────────────────────────────────
  const feeThStyle: React.CSSProperties = {
    background: '#000',
    color: '#fff',
    padding: '2px 3px',
    fontSize: '6.5px',
    fontWeight: '700',
    border: '1px solid #000',
    textAlign: 'left',
  };

  const feeTdStyle: React.CSSProperties = {
    border: '1px solid #000',
    padding: '2px 3px',
    fontSize: '6.5px',
    color: '#000',
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    lineHeight: '1.4',
    fontSize: '7px',
  };

  const lblStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    minWidth: '58px',
    color: '#000',
  };

  const valStyle: React.CSSProperties = {
    fontWeight: '700',
    color: '#000',
    wordBreak: 'break-all',
  };

  // ── notes list ────────────────────────────────────────────────────────────
  const notesList = [
    'Fee can be deposited in any branch of BankIslami Pakistan Ltd.',
    'Fee once paid is not refundable.',
    'If you do not pay your amount within due date, then discount will be cancelled, and you have to pay full challan.',
    'If challan is not paid within due date,then',
    'i.Registration of student will be cancelled after 15 days of due date ii.2nd time struck off student can be enrolled after paying registration fee and pending dues.',
    'iii.3rd time struck off students cannot be enrolled.',
  ];

  return (
    <div>
      {showDownloadButton && (
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            onClick={handleDownload}
            size="sm"
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      )}

      <div
        ref={voucherRef}
        style={{
          background: '#ccc',
          padding: '10px',
          fontFamily: 'Arial, sans-serif',
          width: '100%',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {copies.map((copyLabel) => (
            <div
              key={copyLabel}
              style={{
                background: '#fff',
                border: '2px solid #000',
                fontSize: '7px',
                color: '#000',
                display: 'flex',
                flexDirection: 'column',
                pageBreakInside: 'avoid',
              }}
            >
              {/* ── HEADER ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 60px',
                borderBottom: '2px solid #000',
                minHeight: '52px',
              }}>
                {/* Logo */}
                <div style={{
                  borderRight: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px',
                }}>
                  <img
                    src="/assets/MERIDIANS white LOGO.png"
                    alt="Meridian's School"
                    style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                  />
                </div>

                {/* School Name + Copy Label */}
                <div style={{
                  borderRight: '2px solid #000',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 4px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#000', lineHeight: '1.35' }}>
                    Meridian's Girls Higher<br />Secondary School
                  </div>
                  <div style={{ fontSize: '5.5px', fontWeight: '600', color: '#000', marginTop: '1px', letterSpacing: '0.4px' }}>
                    {motto || 'WALIDAIN KA AITMAD, MERIDIANS KA MEYAR'}
                  </div>
                  <div style={{ fontSize: '6.5px', fontWeight: '600', color: '#000', marginTop: '1px' }}>
                    {copyLabel}
                  </div>
                </div>

                {/* BankIslami Logo */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 2px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#0066b2' }}>BankIslami</span>
                </div>
              </div>

              {/* ── BULLET LINES ── */}
              <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', fontSize: '6.5px', fontWeight: '600' }}>
                &#x25CF; Payable at all branches of BankIslami Pakistan Limited
              </div>
              <div style={{ borderBottom: '1px solid #000', padding: '2px 4px', fontSize: '6.5px', fontWeight: '600' }}>
                &#x25CF; Transaction to be processed via LnkIslami Only
              </div>

              {/* ── BODY ── */}
              <div style={{ padding: '3px 4px', flex: 1 }}>

                {/* INFO — 2 column grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderBottom: '1px solid #000',
                  paddingBottom: '3px',
                  marginBottom: '3px',
                }}>
                  {/* LEFT column */}
                  <div style={{ paddingRight: '4px', borderRight: '1px solid #ccc' }}>
                    {[
                      ['SID :', sid],
                      ['Admission No :', admissionNo],
                      ['Roll No :', rollNumber || ''],
                      ['Challan No :', challanNo],
                      ['Family No :', familyNo],
                    ].map(([label, value]) => (
                      <div key={label} style={infoRowStyle}>
                        <span style={lblStyle}>{label}</span>
                        <span style={valStyle}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT column */}
                  <div style={{ paddingLeft: '4px' }}>
                    {[
                      ['Name', studentName || ''],
                      ['Father', fatherName || ''],
                      ['Father CNIC', fatherCNIC || ''],
                      ['Contact', contact || ''],
                      ['Note', ''],
                    ].map(([label, value]) => (
                      <div key={label} style={infoRowStyle}>
                        <span style={lblStyle}>{label}</span>
                        <span style={valStyle}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class & Due Date - 4 Boxes */}
                <div style={{ borderTop: '1px solid #000', margin: '3px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr 60px 1fr', border: '1px solid #000', fontSize: '8px' }}>
                  <div style={{ borderRight: '1px solid #000', padding: '2px 4px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center' }}>Class</div>
                  <div style={{ borderRight: '1px solid #000', padding: '2px 4px', fontWeight: '700', color: '#000', display: 'flex', alignItems: 'center' }}>{studentClass || ''}</div>
                  <div style={{ borderRight: '1px solid #000', padding: '2px 4px', fontWeight: '600', color: '#000', display: 'flex', alignItems: 'center' }}>Section</div>
                  <div style={{ padding: '2px 4px', fontWeight: '700', color: '#000', display: 'flex', alignItems: 'center' }}>{section || ''}</div>
                </div>
                <div style={{ ...infoRowStyle, marginTop: '1px' }}>
                  <span style={lblStyle}>Due Date:</span>
                  <span style={valStyle}>{dueDate || ''}</span>
                </div>

                {/* ── FEE TABLE ── */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '48%' }} />
                    <col style={{ width: '24%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={feeThStyle}>Fee Month</th>
                      <th style={feeThStyle}>Particular</th>
                      <th style={{ ...feeThStyle, textAlign: 'right' }}>Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(fees || []).map((fee, i) => (
                      <tr key={i} style={{ background: i % 2 === 1 ? '#e0e0e0' : '#fff' }}>
                        <td style={feeTdStyle}>{fee.month}</td>
                        <td style={feeTdStyle}>{fee.particular}</td>
                        <td style={{ ...feeTdStyle, textAlign: 'right' }}>{fee.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#c8c8c8' }}>
                      <td
                        colSpan={2}
                        style={{ ...feeTdStyle, textAlign: 'right', fontWeight: '700', borderTop: '1.5px solid #000' }}
                      >
                        Total
                      </td>
                      <td style={{ ...feeTdStyle, textAlign: 'right', fontWeight: '700', borderTop: '1.5px solid #000' }}>
                        {totalAmount !== undefined ? totalAmount.toLocaleString() : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* ── AMOUNT IN WORDS ── */}
                <div style={{ marginTop: '4px', border: '1.5px solid #000' }}>
                  <div style={{ padding: '2px 3px', fontSize: '7px', fontWeight: '700', color: '#000' }}>
                    {displayAmountInWords}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #000' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2px 3px', borderRight: '1px solid #000' }}>
                      <div style={{ fontSize: '5.5px', color: '#000' }}>Payable Within Due Date</div>
                      <div style={{ fontSize: '7px', fontWeight: '700', color: '#000' }}>{payableWithin !== undefined ? payableWithin.toLocaleString() : ''}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2px 3px' }}>
                      <div style={{ fontSize: '5.5px', color: '#000' }}>Payable After Due Date</div>
                      <div style={{ fontSize: '7px', fontWeight: '700', color: '#000' }}>{payableAfter !== undefined ? payableAfter.toLocaleString() : ''}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── NOTES ── */}
              <div style={{ padding: '2px 4px', borderTop: '1.5px solid #000', marginTop: '2px' }}>
                <div style={{ fontSize: '6.5px', fontWeight: '700', color: '#000', marginBottom: '1px' }}>Note:</div>
                <ol style={{ paddingLeft: '9px', margin: 0 }}>
                  {notesList.map((note, i) => (
                    <li key={i} style={{ fontSize: '5.5px', color: '#000', lineHeight: '1.7' }}>{note}</li>
                  ))}
                </ol>
              </div>

              {instructions && (
                <div style={{ padding: '2px 4px', marginTop: '2px', fontSize: '5.75px', color: '#000' }}>
                  <div style={{ fontWeight: '700', marginBottom: '1px' }}>Instructions:</div>
                  <div>{instructions}</div>
                </div>
              )}

              {/* ── SIGNATURE ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1.5px solid #000' }}>
                <div style={{ padding: '2px 3px', textAlign: 'center', borderRight: '1px solid #000' }}>
                  <div style={{ borderBottom: '1px solid #000', height: '20px', marginBottom: '2px' }} />
                  <div style={{ fontSize: '5.5px', color: '#000', fontWeight: '600' }}>Received Amount By Officials:</div>
                </div>
                <div style={{ padding: '2px 3px', textAlign: 'center' }}>
                  <div style={{ borderBottom: '1px solid #000', height: '20px', marginBottom: '2px' }} />
                  <div style={{ fontSize: '5.5px', color: '#000', fontWeight: '600' }}>Stamp &amp; Signature:</div>
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div style={{
                background: '#e0e0e0',
                borderTop: '1px solid #000',
                padding: '2px 4px',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '5.5px', color: '#000', fontWeight: '600' }}>Printed At: {printDate}</span>
                <span style={{ fontSize: '5.5px', color: '#000', fontWeight: '600' }}>Printed By: Admin</span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VoucherTemplate.displayName = 'VoucherTemplate';

export default VoucherTemplate;