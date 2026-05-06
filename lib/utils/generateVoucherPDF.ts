'use client';

import jsPDF from 'jspdf';

export interface VoucherPDFData {
  studentName: string;
  fatherName: string;
  fatherCNIC?: string;
  rollNumber?: string;
  studentClass: string;
  section?: string;
  sid?: string;
  contact?: string;
  admissionNo?: string;
  challanNo?: string;
  billNo?: string;
  familyNo?: string;
  dueDate?: string;
  fees?: Array<{ month: string; particular: string; amount: number }>;
  totalAmount?: number;
  amountInWords?: string;
  payableWithin?: number;
  payableAfter?: number;
  motto?: string;
  instructions?: string;
  fileName?: string;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  if (!dateStr.includes('T')) return dateStr;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PK', {
      day: '2-digit', month: 'short', year: 'numeric'
    }) + ` (${date.toLocaleDateString('en-PK', { weekday: 'long' })})`;
  } catch {
    return dateStr;
  }
}

export async function generateVoucherPDF(data: VoucherPDFData): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const MX = 4;
  const MY = 5;
  const GAP = 2;
  const CW = (210 - 2 * MX - 2 * GAP) / 3;

  const copies = ['Student Copy', 'Office Copy', 'Bank Copy'];
  const copyX = copies.map((_, i) => MX + i * (CW + GAP));
  const fees = data.fees || [];

  const printDate = new Date().toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const logoBase64 = await loadImageAsBase64('/assets/MERIDIANS white LOGO.png');

  // ── Pre-calculate card height dynamically ──
  const HDR_H = 18;
  const BULLET_H = 11;
  const INFO_GRID_H = 16;
  const PERSONAL_INFO_H = 12;
  const CLASS_SEC_H = 4;
  const DUE_DATE_H = 4;
  const FEE_TABLE_H = (fees.length + 2) * 4; // rows + header + total
  const AMT_WORDS_H = 6;
  const PAYABLES_H = 8;
  const NOTE_HEAD_H = 6;
  const NOTE_CONTENT_H = 7 * 2.8 + 2; // Approx for 7 lines of notes
  const SIGN_FOOT_H = 15;

  const cardH = HDR_H + BULLET_H + INFO_GRID_H + PERSONAL_INFO_H + CLASS_SEC_H + DUE_DATE_H + FEE_TABLE_H + AMT_WORDS_H + PAYABLES_H + NOTE_HEAD_H + NOTE_CONTENT_H + SIGN_FOOT_H;

  // Background color like a real paper
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, 210, 297, 'F');

  for (let ci = 0; ci < 3; ci++) {
    const x = copyX[ci];
    let y = MY;

    // Outer Border
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, CW, cardH, 'FD');

    // ── HEADER ──
    const HDR_H = 18;
    const LW = 12;
    const BW = 16;
    const MW = CW - LW - BW;

    doc.setLineWidth(0.3);
    doc.rect(x, y, LW, HDR_H);
    if (logoBase64) {
      try { doc.addImage(logoBase64, 'PNG', x + 1, y + 2, 10, 10); } catch { /* skip */ }
    }

    doc.rect(x + LW, y, MW, HDR_H);
    const cx = x + LW + MW / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text("Meridian's Girls Higher", cx, y + 4, { align: 'center' });
    doc.text("Secondary School", cx, y + 7, { align: 'center' });
    doc.text("Girls Campus", cx, y + 10, { align: 'center' });

    doc.setLineWidth(0.2);
    doc.line(x + LW, y + 12, x + LW + MW, y + 12);
    doc.setFontSize(5);
    doc.text(copies[ci], cx, y + 16, { align: 'center' });

    doc.rect(x + LW + MW, y, BW, HDR_H);
    doc.setTextColor(0, 102, 178);
    doc.setFontSize(5.5);
    doc.text('BankIslami', x + LW + MW + BW / 2, y + HDR_H / 2, { align: 'center', baseline: 'middle' });
    doc.setTextColor(0, 0, 0);
    y += HDR_H;

    // ── BULLETS ──
    doc.setFontSize(4.2);
    doc.setFont('helvetica', 'bold');
    doc.text('\u2022   Payable at all branches of BankIslami Pakistan Limited', x + 3, y + 4);
    doc.text('\u2022   Transaction to be processed via LinkIslami Only', x + 6, y + 8);
    doc.line(x, y + 11, x + CW, y + 11);
    y += 11;

    // ── INFO GRID ──
    const RH = 4;
    const C1 = 30;

    const leftRows = [
      ['SID :', data.sid || ''],
      ['Admission No :', data.admissionNo || ''],
      ['Roll No :', data.rollNumber || ''],
      ['Family No :', data.familyNo || ''],
    ];

    doc.setFontSize(4.8);
    for (let i = 0; i < 4; i++) {
      doc.setFont('helvetica', 'bold');
      doc.text(leftRows[i][0], x + 1.5, y + RH * i + 3);
      doc.text(leftRows[i][1], x + 18, y + RH * i + 3);
      doc.line(x, y + RH * (i + 1), x + C1, y + RH * (i + 1));
    }
    doc.line(x + C1, y, x + C1, y + 16);

    // Right side of grid
    doc.text('Challan No : ' + (data.challanNo || ''), x + C1 + 2, y + 4);
    doc.text('Bill No: (For Payment via', x + C1 + 2, y + 9);
    doc.text('KuickPay) ' + (data.billNo || '163802546'), x + C1 + 2, y + 13);
    doc.line(x, y + 16, x + CW, y + 16);
    y += 16;

    // Name, Father, Contact
    const fullRows = [
      ['Name', data.studentName],
      ['Father', data.fatherName],
      ['Contact', data.contact],
    ];

    for (const [lbl, val] of fullRows) {
      doc.setFont('helvetica', 'normal');
      doc.text(String(lbl), x + 1.5, y + 3);
      doc.line(x + 18, y, x + 18, y + RH);
      doc.setFont('helvetica', 'bold');
      doc.text(String(val || ''), x + 20, y + 3);
      doc.line(x, y + RH, x + CW, y + RH);
      y += RH;
    }

    // Class & Section
    const QW = CW / 4;
    doc.setFont('helvetica', 'normal');
    doc.text('Class', x + 1.5, y + 3);
    doc.line(x + 18, y, x + 18, y + RH);
    doc.setFont('helvetica', 'bold');
    doc.text(data.studentClass, x + 20, y + 3);
    doc.line(x + QW * 2, y, x + QW * 2, y + RH);
    doc.setFont('helvetica', 'normal');
    doc.text('Section', x + QW * 2 + 1.5, y + 3);
    doc.line(x + QW * 2 + 18, y, x + QW * 2 + 18, y + RH);
    doc.setFont('helvetica', 'bold');
    doc.text(data.section || '', x + QW * 2 + 20, y + 3);
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;

    // Due Date Bar
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Due Date: ${formatDate(data.dueDate)}`, x + 1.5, y + 3);
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;

    // ── FEE TABLE ──
    doc.setFontSize(4.8);
    doc.text('Fee Month', x + 1.5, y + 3);
    doc.line(x + 30, y, x + 30, y + RH + (fees.length + 1) * RH);
    doc.text('Particular', x + 31.5, y + 3);
    doc.line(x + CW - 15, y, x + CW - 15, y + RH + (fees.length + 1) * RH);
    doc.text('Payable', x + CW - 1.5, y + 3, { align: 'right' });
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;

    for (const fee of fees) {
      doc.setFont('helvetica', 'normal');
      doc.text(fee.month, x + 1.5, y + 3);
      doc.text(fee.particular, x + 31.5, y + 3);
      doc.text(fee.amount.toLocaleString(), x + CW - 1.5, y + 3, { align: 'right' });
      doc.line(x, y + RH, x + CW, y + RH);
      y += RH;
    }

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text('Total', x + CW / 2, y + 3, { align: 'center' });
    doc.text(data.totalAmount?.toLocaleString() || '', x + CW - 1.5, y + 3, { align: 'right' });
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;

    // Amount Words
    doc.setFontSize(5);
    doc.text(data.amountInWords || '', x + 1.5, y + 4);
    doc.line(x, y + 6, x + CW, y + 6);
    y += 6;

    // Payables
    doc.setFontSize(4.8);
    doc.text('Payable Within Due Date', x + 1.5, y + 3);
    doc.line(x + CW - 30, y, x + CW - 30, y + 8);
    doc.text(data.payableWithin?.toLocaleString() || '', x + CW - 1.5, y + 3, { align: 'right' });
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;
    doc.text('Payable After Due Date', x + 1.5, y + 3);
    doc.text(data.payableAfter?.toLocaleString() || '', x + CW - 1.5, y + 3, { align: 'right' });
    doc.line(x, y + RH, x + CW, y + RH);
    y += RH;

    // ── NOTES ──
    y += 1;
    doc.setFontSize(5);
    doc.text('Note', x + 1.5, y + 2);
    y += 5;
    doc.setFontSize(3.8);
    doc.setFont('helvetica', 'normal');
    const noteLines = [
      '1.. Fee can be deposited in any branch of BankIslami Pakistan Ltd.',
      '2. Fee once paid is not refundable.',
      '3.. If you do not pay your amount within due date, then discount will be cancelled, and you have to pay full challan.',
      '4. If challan is not paid within due date,then',
      'i. Registration of student will be cancelled after 15 days of due date',
      'ii. 2nd time struck off student can be enrolled after paying registration fee and pending dues.',
      'iii. 3rd time struck off students cannot be enrolled.'
    ];
    for (const line of noteLines) {
      const splitLines = doc.splitTextToSize(line, CW - 4);
      for (const sl of splitLines) {
        doc.text(sl, x + 1.5, y);
        y += 2.8;
      }
    }

    // Signatures (Ensure it stays below notes but also at bottom of card)
    y = Math.max(y + 6, MY + cardH - 12);
    doc.setFontSize(4.8);
    doc.setFont('helvetica', 'bold');
    doc.text('Received Amount By Officials:', x + 1.5, y);
    doc.text('Stamp & Signature:', x + CW - 1.5, y, { align: 'right' });

    // Footer
    doc.line(x, y + 3, x + CW, y + 3);
    y += 6.5;
    doc.setFontSize(4.2);
    doc.text(`Printed at: ${printDate}`, x + 1.5, y);
    doc.text('Printed By: admin', x + CW - 1.5, y, { align: 'right' });
  }

  const name = data.fileName || `fee-voucher-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(name);
}
