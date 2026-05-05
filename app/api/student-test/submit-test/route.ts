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
    const { testId, admissionId, answers } = body;

    // Validate required fields
    if (!testId || !admissionId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: testId, admissionId, answers' },
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

    // Get student info from admission ID
    const admissionQuery = await AdmissionQuery.findById(admissionId);
    if (!admissionQuery) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    // Calculate score and detailed results
    let calculatedScore = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;
    const testAnswers: any[] = [];

    test.mcqs.forEach((mcq: any, idx: number) => {
      const selectedOption = answers[idx];
      const isCorrect = selectedOption === mcq.correctAnswer;
      
      if (selectedOption !== undefined) {
        if (isCorrect) {
          calculatedScore += mcq.marks || 1;
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      } else {
        unattempted++;
      }

      testAnswers.push({
        questionIndex: idx,
        selectedOption: selectedOption ?? -1,
        correctOption: mcq.correctAnswer,
        isCorrect,
        marks: isCorrect ? (mcq.marks || 1) : 0
      });
    });

    const percentage = (calculatedScore / test.totalMarks) * 100;
    const isPassed = percentage >= (test.passingMarks / test.totalMarks) * 100;

    // Update admission query with test results
    admissionQuery.testScore = calculatedScore;
    admissionQuery.testPassed = isPassed;
    admissionQuery.testCompleted = true;
    admissionQuery.testCompletedAt = new Date();
    admissionQuery.status = isPassed ? 'test_passed' : 'pending'; // Reset to pending if failed (for retake)
    admissionQuery.testAnswers = testAnswers;
    admissionQuery.testDetails = {
      totalMarks: test.totalMarks,
      passingMarks: test.passingMarks,
      percentage: Math.round(percentage * 100) / 100,
      correctAnswers,
      wrongAnswers,
      unattempted
    };

    // Generate voucher if passed
    if (isPassed) {
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
