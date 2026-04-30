import { connectDB } from '@/lib/db';
import Note from '@/lib/models/Note';
import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectDB();
    
    const formData = await request.formData();
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const classId = formData.get('classId') as string;
    const pdfFile = formData.get('pdf') as File | null;

    // Get existing note
    const existingNote = await Note.findById(params.id);
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    let finalPdfUrl = existingNote.pdfUrl;

    // Store old ID before any operations
    const oldPdfPublicId = (existingNote.pdfUrl?.includes('cloudinary.com'))
      ? cloudinaryService.getPublicId(existingNote.pdfUrl)
      : null;

    // Upload new PDF if provided
    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      const uploadResult = await cloudinaryService.uploadPdf(pdfBuffer, 'notes/pdfs', pdfFile.name);
      finalPdfUrl = uploadResult.secure_url;
    }

    // Update DB first (critical operation)
    const updatedNote = await Note.findByIdAndUpdate(
      params.id,
      { 
        subject: subject || existingNote.subject,
        description: description || existingNote.description,
        class: classId || existingNote.class,
        pdfUrl: finalPdfUrl
      },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Delete old file after DB update
    if (oldPdfPublicId && finalPdfUrl !== existingNote.pdfUrl) {
      try {
        await cloudinaryService.deleteImage(oldPdfPublicId);
        console.log('Deleted old PDF:', oldPdfPublicId);
      } catch (error) {
        console.error('Failed to delete old PDF:', error);
      }
    }

    return NextResponse.json(
      { message: 'Note updated successfully', item: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectDB();
    
    // Get note to find PDF public ID
    const note = await Note.findById(params.id);
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if applicable
    if (note.pdfUrl?.includes('cloudinary.com')) {
      const publicId = cloudinaryService.getPublicId(note.pdfUrl);
      if (publicId) {
        try {
          await cloudinaryService.deleteImage(publicId);
        } catch (error) {
          console.error('Failed to delete PDF from Cloudinary:', error);
        }
      }
    }

    await Note.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Note deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
