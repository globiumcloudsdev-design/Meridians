import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env.local') });
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';

const categories = ['Announcement', 'Success Story', 'News', 'Event', 'General', 'Tips', 'Scholarship', 'Admissions', 'Technology', 'Career', 'Student Life', 'Faculty', 'Research', 'Community', 'Achievements'];
const tags = ['education', 'learning', 'school', 'university', 'students', 'teachers', 'exams', 'results', 'admissions', 'career', 'success', 'event', 'news', 'tips', 'scholarship', 'technology', 'community', 'research', 'faculty', 'life'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTags(): string[] {
  return Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => randomFrom(tags))));
}

function randomDate(): Date {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date().getTime();
  return new Date(start + Math.random() * (end - start));
}

function randomExcerpt(): string {
  return 'This is a short summary about the blog post. It covers key points and invites readers to learn more.';
}

function randomContent(title: string): string {
  return `## ${title}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae velit ex. Mauris dapibus risus quis suscipit vulputate. Integer non erat nec nulla dictum placerat.\n\n- Key Point 1\n- Key Point 2\n- Key Point 3\n\nRead more for detailed insights.`;
}

function randomMeta(title: string): { metaTitle: string; metaDescription: string; metaKeywords: string[] } {
  return {
    metaTitle: `${title} | Meridian Education Blog`,
    metaDescription: 'Explore the latest in education, student life, and academic success at Meridian.',
    metaKeywords: randomTags(),
  };
}

async function seedBlogPosts() {
  await connectDB();
  await BlogPost.deleteMany({});

  const posts = [];
  for (let i = 1; i <= 50; i++) {
    const title = `Education Blog Post #${i}`;
    const slug = `education-blog-post-${i}`;
    const category = randomFrom(categories);
    const post = {
      title,
      slug,
      excerpt: randomExcerpt(),
      content: randomContent(title),
      imageUrl: `https://source.unsplash.com/800x400/?education,school,students&sig=${i}`,
      author: randomFrom(['Admin', 'Faculty', 'Student', 'Guest']),
      category,
      tags: randomTags(),
      status: 'published',
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 200),
      comments: [],
      featured: i % 10 === 0,
      publishedAt: randomDate(),
      updatedAt: randomDate(),
      ...randomMeta(title),
    };
    posts.push(post);
  }

  await BlogPost.insertMany(posts);
  console.log('Seeded 50 education blog posts!');
  mongoose.connection.close();
}

seedBlogPosts();
