import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Poster from '@/lib/models/Poster';

export async function GET() {
  try {
    await connectDB();
    const activePoster = await Poster.findOne({ isActive: true }).sort({ updatedAt: -1, createdAt: -1 });

    if (!activePoster) {
      return NextResponse.json({ error: 'No active poster found' }, { status: 404 });
    }

    return NextResponse.json(activePoster, { status: 200 });
  } catch (error) {
    console.error('Error fetching active poster:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
