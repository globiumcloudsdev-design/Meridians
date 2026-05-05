import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Test from '@/lib/models/Test';
import Class from '@/lib/models/Class';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');

    if (!className) {
      return NextResponse.json(
        { error: 'Class parameter required' },
        { status: 400 }
      );
    }

    await connectDB();

    // First find the Class by name to get its ObjectId
    const classDoc = await Class.findOne({ name: className });
    if (!classDoc) {
      return NextResponse.json(
        { error: `Class '${className}' not found` },
        { status: 404 }
      );
    }

    // Find test for this class using ObjectId
    const test = await Test.findOne({
      class: classDoc._id,
      isActive: true
    });

    if (!test) {
      return NextResponse.json(
        { error: `No active test found for class ${className}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      testId: test._id.toString(),
      testName: test.name,
      class: className,
      // Full test data for TestTakingClient
      test: {
        _id: test._id.toString(),
        title: test.name,
        name: test.name,
        description: test.description || '',
        class: className,
        mcqs: test.mcqs,
        totalMarks: test.totalMarks,
        correctAnswerMarks: test.correctAnswerMarks,
        passingMarks: test.passingMarks,
        timeLimit: test.timeLimit || 30,
        isActive: test.isActive,
        createdAt: test.createdAt?.toISOString(),
        updatedAt: test.updatedAt?.toISOString(),
      }
    });

  } catch (error) {
    console.error('Error finding test:', error);
    return NextResponse.json(
      { error: 'Failed to find test' },
      { status: 500 }
    );
  }
}
