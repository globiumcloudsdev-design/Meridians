import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      class: className,
      fatherName,
      shift,
      fatherOccupation,
      fatherCnic,
      homeAddress,
      subjects,
      dob,
      contact1,
      contact2,
      parentEmail,
      program,
      message
    } = body;

    const cleanedName = typeof name === 'string' ? name.trim() : '';
    const cleanedClass = typeof className === 'string' ? className.trim() : '';
    const cleanedContact1 = typeof contact1 === 'string' ? contact1.trim() : '';
    const cleanedParentEmail = typeof parentEmail === 'string' ? parentEmail.trim().toLowerCase() : '';
    const cleanedProgram = typeof program === 'string' ? program.trim() : '';

    if (!cleanedName || !cleanedParentEmail || !cleanedClass || !cleanedContact1 || !cleanedProgram) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const admissionQuery = new AdmissionQuery({
      name: cleanedName,
      class: cleanedClass,
      fatherName,
      shift,
      fatherOccupation,
      fatherCnic,
      homeAddress,
      subjects,
      dob,
      contact1: cleanedContact1,
      contact2,
      parentEmail: cleanedParentEmail,
      program: cleanedProgram,
      message: typeof message === 'string' ? message.trim() : '',
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
