import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing query id' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Missing status field' },
        { status: 400 }
      );
    }

    // Validate status value
    if (!['pending', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be "pending" or "replied"' },
        { status: 400 }
      );
    }

    const query = await AdmissionQuery.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!query) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(query, { status: 200 });
  } catch (error) {
    console.error('Error updating admission query:', error);
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
        { error: 'Missing query id' },
        { status: 400 }
      );
    }

    const result = await AdmissionQuery.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Query deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting admission query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
