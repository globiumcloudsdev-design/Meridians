import { connectDB } from '@/lib/db';
import Class from '@/lib/models/Class';
import { NextRequest, NextResponse } from 'next/server';

// PUT - Update a class
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectDB();
    const body = await request.json();
    const { name, fees, description, isActive } = body;

    const updatedClass = await Class.findByIdAndUpdate(
      params.id,
      { name, fees, description, isActive },
      { new: true }
    );

    if (!updatedClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Class updated successfully', class: updatedClass },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a class
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectDB();
    const deletedClass = await Class.findByIdAndDelete(params.id);

    if (!deletedClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Class deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
