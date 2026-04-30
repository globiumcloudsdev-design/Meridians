import { connectDB } from '@/lib/db';
import Note from '@/lib/models/Note';
import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const notes = await Note.find().populate('class', 'name').sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const classId = formData.get('classId') as string;
    const pdfFile = formData.get('pdf') as File | null;

    if (!subject || !description || !classId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    // Upload PDF
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfUpload = await cloudinaryService.uploadPdf(pdfBuffer, 'notes/pdfs', pdfFile.name);
    const finalPdfUrl = pdfUpload.secure_url;

    const newNote = new Note({
      subject,
      description,
      class: classId,
      pdfUrl: finalPdfUrl,
    });

    await newNote.save();

    return NextResponse.json(
      { message: 'Note created successfully', item: newNote },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
