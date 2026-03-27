import { connectDB } from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const posts = await BlogPost.find().sort({ publishedAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, author, category } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      imageUrl: imageUrl || '',
      author: author || 'Admin',
      category: category || 'General',
    });

    await post.save();

    return NextResponse.json(
      { message: 'Blog post created successfully', post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
