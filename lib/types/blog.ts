// Blog post type definitions

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  views?: number;
  likes?: number;
  comments?: BlogComment[];
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface BlogComment {
  user: string;
  comment: string;
  date: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}
