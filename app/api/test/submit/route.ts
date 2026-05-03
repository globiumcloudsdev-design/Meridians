import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import Test from '@/lib/models/Test';
import Class from '@/lib/models/Class';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/test/submit - Submit test results
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { testId, token, answers } = body;

    // Validate required fields
    if (!testId || !token || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: testId, token, answers' },
        { status: 400 }
      );
    }

    // Get test details
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Get student info from token
    const admissionQuery = await AdmissionQuery.findOne({ testToken: token });
    if (!admissionQuery) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    // Calculate score
    let calculatedScore = 0;
    test.mcqs.forEach((mcq: any, idx: number) => {
      if (answers[idx] === mcq.correctAnswer) {
        calculatedScore += mcq.marks || 1;
      }
    });

    const percentage = (calculatedScore / test.totalMarks) * 100;
    const isPassed = percentage >= (test.passingMarks / test.totalMarks) * 100;

    // Update admission query with test results
    admissionQuery.testScore = calculatedScore;
    admissionQuery.testPassed = isPassed;
    admissionQuery.testCompleted = true;
    admissionQuery.testCompletedAt = new Date();

    // Remove token after successful pass so link can no longer be reused
    if (isPassed) {
      admissionQuery.testToken = undefined;
      admissionQuery.testTokenExpiry = undefined;

      const classInfo = await Class.findById(test.class);
      const classFees = classInfo?.fees || 0;
      const admissionFee = classFees;
      const totalFee = classFees + admissionFee;
      const payableWithin = totalFee;
      const payableAfter = totalFee + 500;
      const issueDate = new Date();
      const dueDate = new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      admissionQuery.voucherData = {
        voucherNumber: `VCH-${Date.now()}`,
        challanNo: `CH-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName: admissionQuery.name,
        fatherName: admissionQuery.fatherName || '',
        fatherCnic: admissionQuery.fatherCnic || '',
        studentClass: admissionQuery.class,
        shift: admissionQuery.shift || '',
        contact: admissionQuery.contact1 || admissionQuery.parentEmail || '',
        testScore: calculatedScore,
        totalMarks: test.totalMarks,
        percentage: percentage.toFixed(2),
        classFees,
        admissionFee,
        totalFee,
        payableWithin,
        payableAfter,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        motto: 'Building Confidence Through Expression',
        instructions: 'Please submit the fee before the due date to confirm admission.',
      };
    }
    
    await admissionQuery.save();

    return NextResponse.json({
      success: true,
      message: 'Test submitted successfully',
      score: calculatedScore,
      totalMarks: test.totalMarks,
      percentage: percentage.toFixed(2),
      isPassed,
      voucher: admissionQuery.voucherData || null,
    }, { status: 200 });

  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    );
  }
}
