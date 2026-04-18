import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Poster from '@/lib/models/Poster';

export async function GET() {
  try {
    await connectDB();
    const posters = await Poster.find().sort({ updatedAt: -1, createdAt: -1 });
    return NextResponse.json(posters, { status: 200 });
  } catch (error) {
    console.error('Error fetching posters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { imageUrl, title, subtitle, isActive, buttonText, buttonUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (isActive === true) {
      await Poster.updateMany({ isActive: true }, { $set: { isActive: false } });
    }

    const created = await Poster.create({
      imageUrl,
      title: title || '',
      subtitle: subtitle || '',
      isActive: Boolean(isActive),
      buttonText: buttonText || '',
      buttonUrl: buttonUrl || '',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating poster:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
