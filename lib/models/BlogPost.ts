import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  views?: number;
  likes?: number;
  comments?: Array<{ user: string; comment: string; date: Date }>;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [
      {
        user: String,
        comment: String,
        date: Date,
      },
    ],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  metaKeywords: {
    type: [String],
    default: [],
  },
  author: {
    type: String,
    default: 'Admin',
  },
  category: {
    type: String,
    default: 'General',
  },
  publishedAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
