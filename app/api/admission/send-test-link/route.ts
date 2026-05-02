import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { API_ADMISSION_GO_TO_TEST } from '@/lib/api/endpoints';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { admissionId } = await request.json();
    
    if (!admissionId) {
      return NextResponse.json(
        { error: 'Admission ID is required' },
        { status: 400 }
      );
    }

    const admission = await AdmissionQuery.findById(admissionId);
    
    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    const testToken = crypto.randomBytes(32).toString('hex');
    const testTokenExpiry = new Date();
    testTokenExpiry.setHours(testTokenExpiry.getHours() + 48);

    admission.testToken = testToken;
    admission.testTokenExpiry = testTokenExpiry;
    admission.status = 'test_sent';
    await admission.save();

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const testLink = `${baseUrl}${API_ADMISSION_GO_TO_TEST}?token=${testToken}`;

    const emailSubject = 'Admission Test Link - Globium Education System';
    const emailBody = `
      Dear ${admission.name},

      Congratulations! Your admission application has been reviewed and approved for the entrance test.

      Here is your unique test link:
      ${testLink}

      Test Details:
      - Student Name: ${admission.name}
      - Class Applied: ${admission.class}
      - Test Valid Until: ${testTokenExpiry.toLocaleString()}

      Important Instructions:
      1. Click the link above to access your test
      2. You have limited time per question
      3. Once you start, you must complete the test
      4. The link can only be used once

      Good luck!

      Best regards,
      Globium Education System
    `;

    await sendEmail({
      to: admission.parentEmail,
      subject: emailSubject,
      text: emailBody,
    });

    return NextResponse.json({
      message: 'Test link sent successfully',
      testToken,
    });

  } catch (error) {
    console.error('Error sending test link:', error);
    return NextResponse.json(
      { error: 'Failed to send test link' },
      { status: 500 }
    );
  }
}
