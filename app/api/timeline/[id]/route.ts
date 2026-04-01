import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Timeline from '@/lib/models/Timeline';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const event = await Timeline.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching timeline event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const updated = await Timeline.findByIdAndUpdate(
      id,
      {
        title: body.title ?? undefined,
        date: body.date ?? undefined,
        description: body.description ?? undefined,
        icon: body.icon ?? undefined,
        order: body.order ?? undefined,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating timeline event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await Timeline.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Timeline event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Timeline event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
