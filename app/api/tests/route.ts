import { connectDB } from '@/lib/db';
import Test from '@/lib/models/Test';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tests - Get all tests
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const tests = await Test.find()
      .populate('class', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json(tests, { status: 200 });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tests - Create a new test
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const {
      title,
      description,
      classId,
      mcqs,
      totalMarks,
      correctAnswerMarks,
      passingMarks,
      timeLimit,
      isActive,
    } = body;

    // Validation
    if (!title || !classId || !mcqs || mcqs.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!correctAnswerMarks) {
      return NextResponse.json(
        { error: 'Correct answer marks is required' },
        { status: 400 }
      );
    }

    if (passingMarks === undefined || passingMarks < 0) {
      return NextResponse.json(
        { error: 'Passing marks is required' },
        { status: 400 }
      );
    }

    // Validate each MCQ
    for (const mcq of mcqs) {
      if (!mcq.question || !mcq.options || mcq.options.length !== 4 || 
          mcq.correctAnswer === undefined || mcq.correctAnswer < 0 || mcq.correctAnswer > 3) {
        return NextResponse.json(
          { error: 'Invalid MCQ data. Each MCQ must have question, 4 options, and correct answer (0-3)' },
          { status: 400 }
        );
      }
    }

    const newTest = new Test({
      title,
      description,
      class: classId,
      mcqs,
      totalMarks: totalMarks || mcqs.reduce((sum: number, mcq: any) => sum + (mcq.marks || 1), 0),
      correctAnswerMarks: correctAnswerMarks || 1,
      passingMarks: passingMarks || 0,
      timeLimit: Math.max(5, timeLimit || 30),
      isActive: isActive ?? true,
    });

    await newTest.save();

    return NextResponse.json(
      { message: 'Test created successfully', test: newTest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
