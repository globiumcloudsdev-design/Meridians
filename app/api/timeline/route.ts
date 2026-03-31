import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Timeline from '@/lib/models/Timeline';

export async function GET() {
  try {
    await connectDB();
    const events = await Timeline.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, date, description, icon, order } = body;

    if (!title || !date || !description || !icon || order === undefined || order === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await Timeline.create({
      title,
      date,
      description,
      icon,
      order: Number(order),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
