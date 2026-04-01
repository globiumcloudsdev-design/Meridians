import { connectDB } from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

      const { slug } = await params;
      const post = await BlogPost.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      imageUrl,
      author,
      category,
      featured,
      status,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      views,
      likes,
      comments,
    } = body;
    const { slug } = await params;

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      {
        title: title ?? undefined,
        excerpt: excerpt ?? undefined,
        content: content ?? undefined,
        imageUrl: imageUrl ?? undefined,
        author: author ?? undefined,
        category: category ?? undefined,
        featured: featured ?? undefined,
        status: status ?? undefined,
        tags: tags ?? undefined,
        metaTitle: metaTitle ?? undefined,
        metaDescription: metaDescription ?? undefined,
        metaKeywords: metaKeywords ?? undefined,
        views: views ?? undefined,
        likes: likes ?? undefined,
        comments: comments ?? undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
