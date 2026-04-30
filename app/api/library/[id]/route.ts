import { connectDB } from '@/lib/db';
import Library from '@/lib/models/Library';
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
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const pdfFile = formData.get('pdf') as File | null;

    // Get existing item
    const existingItem = await Library.findById(params.id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    let finalThumbnail = existingItem.thumbnail;
    let finalPdfUrl = existingItem.pdfUrl;

    // Store old IDs before any operations
    const oldThumbnailPublicId = (existingItem.thumbnail?.includes('cloudinary.com'))
      ? cloudinaryService.getPublicId(existingItem.thumbnail)
      : null;
    
    const oldPdfPublicId = (existingItem.pdfUrl?.includes('cloudinary.com'))
      ? cloudinaryService.getPublicId(existingItem.pdfUrl)
      : null;

    // Upload new thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const uploadResult = await cloudinaryService.uploadImage(thumbnailBuffer, 'library/thumbnails');
      finalThumbnail = uploadResult.secure_url;
    }

    // Upload new PDF if provided
    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      const uploadResult = await cloudinaryService.uploadPdf(pdfBuffer, 'library/pdfs', pdfFile.name);
      finalPdfUrl = uploadResult.secure_url;
    }

    // Update DB first (critical operation)
    const updatedItem = await Library.findByIdAndUpdate(
      params.id,
      { 
        title: title || existingItem.title,
        thumbnail: finalThumbnail,
        description: description || existingItem.description,
        pdfUrl: finalPdfUrl
      },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    // Delete old files after DB update (non-critical, can be cleaned up later)
    if (oldThumbnailPublicId && finalThumbnail !== existingItem.thumbnail) {
      try {
        await cloudinaryService.deleteImage(oldThumbnailPublicId);
        console.log('Deleted old thumbnail:', oldThumbnailPublicId);
      } catch (error) {
        console.error('Failed to delete old thumbnail (will be cleaned up later):', error);
      }
    }

    if (oldPdfPublicId && finalPdfUrl !== existingItem.pdfUrl) {
      try {
        await cloudinaryService.deleteImage(oldPdfPublicId);
        console.log('Deleted old PDF:', oldPdfPublicId);
      } catch (error) {
        console.error('Failed to delete old PDF (will be cleaned up later):', error);
      }
    }

    return NextResponse.json(
      { message: 'Library item updated successfully', item: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating library item:', error);
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
    const deletedItem = await Library.findByIdAndDelete(params.id);

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Library item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Library item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting library item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
