import { connectDB } from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, isRead } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing message id' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    // Validate status value if provided
    if (status && !['pending', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be "pending" or "replied"' },
        { status: 400 }
      );
    }

    const message = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing message id' },
        { status: 400 }
      );
    }

    const result = await ContactMessage.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
