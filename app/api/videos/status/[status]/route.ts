// app/api/videos/status/[status]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Video from '@/lib/models/video';
export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  try {
    await connectDB();
    const videos = await Video.find({ status: params.status });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}