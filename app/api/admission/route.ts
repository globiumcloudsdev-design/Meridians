import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import { cloudinaryService } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Helper to convert File to Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper to upload file to Cloudinary
async function uploadToCloudinary(file: File, folder: string = 'admissions') {
  const buffer = await fileToBuffer(file);
  
  if (file.type === 'application/pdf') {
    return await cloudinaryService.uploadPdf(buffer, folder, file.name);
  } else {
    return await cloudinaryService.uploadImage(buffer, folder);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const className = formData.get('class') as string;
    const fatherName = formData.get('fatherName') as string;
    const shift = formData.get('shift') as string;
    const fatherCnic = formData.get('fatherCnic') as string;
    const homeAddress = formData.get('homeAddress') as string;
    const dob = formData.get('dob') as string;
    const contact1 = formData.get('contact1') as string;
    const parentEmail = formData.get('parentEmail') as string;
    const program = formData.get('program') as string;
    const message = formData.get('message') as string;
    
    // Extract files
    const file1 = formData.get('document1') as File | null;
    const file2 = formData.get('document2') as File | null;

    const cleanedName = name?.trim() || '';
    const cleanedClass = className?.trim() || '';
    const cleanedContact1 = contact1?.trim() || '';
    const cleanedParentEmail = parentEmail?.trim().toLowerCase() || '';
    const cleanedProgram = program?.trim() || '';

    if (!cleanedName || !cleanedParentEmail || !cleanedClass || !cleanedContact1 || !cleanedProgram) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary
    const documents: { url: string; publicId: string; name: string; size: number; type: string }[] = [];
    
    if (file1) {
      try {
        const result = await uploadToCloudinary(file1, 'admissions');
        documents.push({
          url: result.secure_url,
          publicId: result.public_id,
          name: file1.name,
          size: file1.size,
          type: file1.type,
        });
      } catch (uploadError) {
        console.error('Error uploading document 1:', uploadError);
      }
    }
    
    if (file2) {
      try {
        const result = await uploadToCloudinary(file2, 'admissions');
        documents.push({
          url: result.secure_url,
          publicId: result.public_id,
          name: file2.name,
          size: file2.size,
          type: file2.type,
        });
      } catch (uploadError) {
        console.error('Error uploading document 2:', uploadError);
      }
    }

    const admissionQuery = new AdmissionQuery({
      name: cleanedName,
      class: cleanedClass,
      fatherName: fatherName?.trim(),
      shift: shift?.trim(),
      fatherCnic: fatherCnic?.trim(),
      homeAddress: homeAddress?.trim(),
      dob: dob?.trim(),
      contact1: cleanedContact1,
      parentEmail: cleanedParentEmail,
      program: cleanedProgram,
      message: message?.trim() || '',
      status: 'pending',
      documents: documents.length > 0 ? documents : undefined,
    });

    await admissionQuery.save();

    return NextResponse.json(
      { 
        message: 'Admission query saved successfully', 
        id: admissionQuery._id,
        documentsUploaded: documents.length,
      },
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

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // If token provided, return specific admission with limited fields
    if (token) {
      const admission = await AdmissionQuery.findOne({ 
        testToken: token 
      }).select('name class testToken testTokenExpiry fatherCnic');

      if (!admission) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        studentName: admission.name,
        studentClass: admission.class,
        fatherCnic: admission.fatherCnic,
        testToken: admission.testToken,
        testTokenExpiry: admission.testTokenExpiry
      }, { status: 200 });
    }

    // Otherwise return all queries (admin view)
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
