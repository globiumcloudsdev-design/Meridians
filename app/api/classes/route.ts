import { connectDB } from '@/lib/db';
import Class from '@/lib/models/Class';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get all classes
export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find({}).sort({ createdAt: -1 });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new class
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, fees, description, isActive } = body;

    // Validate required fields
    if (!name || fees === undefined || !description) {
      return NextResponse.json(
        { error: 'Name, fees, and description are required' },
        { status: 400 }
      );
    }

    const newClass = await Class.create({
      name,
      fees,
      description,
      isActive: isActive ?? true,
    });

    return NextResponse.json(
      { message: 'Class created successfully', class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
