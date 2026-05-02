import { connectDB } from '@/lib/db';
import Test from '@/lib/models/Test';
import Class from '@/lib/models/Class';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tests/[id] - Get a single test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const test = await Test.findById(id).populate('class', 'name');
    
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(test, { status: 200 });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tests/[id] - Update a test
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const {
      title,
      description,
      classId,
      subject,
      mcqs,
      totalMarks,
      correctAnswerMarks,
      passingMarks,
      timeLimit,
      isActive,
    } = body;

    // Check if test exists
    const existingTest = await Test.findById(id);
    if (!existingTest) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Validate MCQs if provided
    if (mcqs && mcqs.length > 0) {
      for (const mcq of mcqs) {
        if (!mcq.question || !mcq.options || mcq.options.length !== 4 || 
            mcq.correctAnswer === undefined || mcq.correctAnswer < 0 || mcq.correctAnswer > 3) {
          return NextResponse.json(
            { error: 'Invalid MCQ data. Each MCQ must have question, 4 options, and correct answer (0-3)' },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (classId !== undefined) updateData.class = classId;
    if (subject !== undefined) updateData.subject = subject;
    if (mcqs !== undefined) updateData.mcqs = mcqs;
    if (totalMarks !== undefined) updateData.totalMarks = totalMarks;
    if (correctAnswerMarks !== undefined) updateData.correctAnswerMarks = correctAnswerMarks;
    if (passingMarks !== undefined) updateData.passingMarks = passingMarks;
    if (timeLimit !== undefined) updateData.timeLimit = Math.max(5, timeLimit);
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('class', 'name');

    return NextResponse.json(
      { message: 'Test updated successfully', test: updatedTest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tests/[id] - Delete a test
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const test = await Test.findByIdAndDelete(id);
    
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Test deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
