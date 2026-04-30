import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'blogs';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    // Upload to Cloudinary
    let result;
    if (file.type === 'application/pdf') {
      result = await cloudinaryService.uploadPdf(bufferData, folder, file.name);
    } else {
      result = await cloudinaryService.uploadImage(bufferData, folder);
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      imageUrl: result.secure_url, // For backward compatibility
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const deleted = await cloudinaryService.deleteImage(publicId);

    if (deleted) {
      return NextResponse.json(
        { success: true, message: 'Image deleted successfully' }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
