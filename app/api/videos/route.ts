// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Video from '@/lib/models/video';

// GET - Fetch all videos
export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validation
    if (!body.title || !body.description || !body.link) {
      return NextResponse.json(
        { error: 'Title, description, and link are required' },
        { status: 400 }
      );
    }
    
    const video = await Video.create(body);
    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create video' },
      { status: 500 }
    );
  }
}