import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env.local') });
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Timeline from '@/lib/models/Timeline';

const currentYear = new Date().getFullYear();

const timelineEvents = [
  {
    title: 'Portal Opens',
    date: `15 Jan ${currentYear}`,
    description: 'Digital registration goes live.',
    icon: 'Globe',
    order: 1,
  },
  {
    title: 'Registration Close',
    date: `28 Feb ${currentYear}`,
    description: 'Final day to submit applications.',
    icon: 'Clock',
    order: 2,
  },
  {
    title: 'Assessment Week',
    date: `15 Mar ${currentYear}`,
    description: 'Interactive tests and reviews.',
    icon: 'ClipboardCheck',
    order: 3,
  },
  {
    title: 'Selection List',
    date: `05 Apr ${currentYear}`,
    description: 'Announcement of selected students.',
    icon: 'Award',
    order: 4,
  },
  {
    title: 'Fee Submission',
    date: `15 Apr ${currentYear}`,
    description: "Secure your child's seat officially.",
    icon: 'Building2',
    order: 5,
  },
  {
    title: 'Session Start',
    date: `01 Jun ${currentYear}`,
    description: 'Grand welcome for the new batch.',
    icon: 'Star',
    order: 6,
  },
];

async function seedTimeline() {
  await connectDB();
  await Timeline.deleteMany({});
  await Timeline.insertMany(timelineEvents);
  console.log(`Seeded ${timelineEvents.length} timeline events for ${currentYear}`);
  mongoose.connection.close();
}

seedTimeline();
