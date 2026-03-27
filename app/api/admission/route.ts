import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, program, message } = body;

    if (!name || !email || !phone || !program) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const admissionQuery = new AdmissionQuery({
      name,
      email,
      phone,
      program,
      message: message || '',
      status: 'pending',
    });

    await admissionQuery.save();

    return NextResponse.json(
      { message: 'Admission query saved successfully', id: admissionQuery._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving admission query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const queries = await AdmissionQuery.find().sort({ createdAt: -1 });

    return NextResponse.json(queries, { status: 200 });
  } catch (error) {
    console.error('Error fetching admission queries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
