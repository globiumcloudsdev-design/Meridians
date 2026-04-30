import { connectDB } from '@/lib/db';
import Library from '@/lib/models/Library';
import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const items = await Library.find().sort({ createdAt: -1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching library items:', error);
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
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!thumbnailFile || !pdfFile) {
      return NextResponse.json(
        { error: 'Thumbnail and PDF file are required' },
        { status: 400 }
      );
    }

    // Upload thumbnail
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const thumbnailUpload = await cloudinaryService.uploadImage(thumbnailBuffer, 'library/thumbnails');
    const thumbnailUrl = thumbnailUpload.secure_url;

    // Upload PDF
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfUpload = await cloudinaryService.uploadPdf(pdfBuffer, 'library/pdfs', pdfFile.name);
    const finalPdfUrl = pdfUpload.secure_url;

    const newItem = new Library({
      title,
      thumbnail: thumbnailUrl,
      description,
      pdfUrl: finalPdfUrl,
    });

    await newItem.save();

    return NextResponse.json(
      { message: 'Library item created successfully', item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating library item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
