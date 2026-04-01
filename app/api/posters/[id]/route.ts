import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Poster from '@/lib/models/Poster';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const poster = await Poster.findById(id);
    if (!poster) {
      return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
    }

    return NextResponse.json(poster, { status: 200 });
  } catch (error) {
    console.error('Error fetching poster:', error);
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

    const requestedActive = body.isActive === true;
    if (requestedActive) {
      await Poster.updateMany({ _id: { $ne: id }, isActive: true }, { $set: { isActive: false } });
    }

    const updated = await Poster.findByIdAndUpdate(
      id,
      {
        imageUrl: body.imageUrl ?? undefined,
        title: body.title ?? undefined,
        subtitle: body.subtitle ?? undefined,
        isActive: body.isActive ?? undefined,
        buttonText: body.buttonText ?? undefined,
        buttonUrl: body.buttonUrl ?? undefined,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating poster:', error);
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

    const deleted = await Poster.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Poster deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting poster:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
