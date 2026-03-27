import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env.local') });
import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import AdmissionQuery from '../lib/models/AdmissionQuery';
import Subscriber from '../lib/models/Subscriber';
import ContactMessage from '../lib/models/ContactMessage';

const admissionQueries = [
  {
    name: 'Ali Raza',
    email: 'ali.raza@example.com',
    phone: '03001234567',
    program: 'Matric',
    message: 'Interested in Matric program. Please share details.',
    processed: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@example.com',
    phone: '03111234567',
    program: 'FSc Pre-Medical',
    message: 'Want to know about FSc Pre-Medical admissions.',
    processed: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    name: 'Usman Khan',
    email: 'usman.khan@example.com',
    phone: '03221234567',
    program: 'ICS',
    message: 'Is ICS available for evening classes?',
    processed: false,
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@example.com',
    phone: '03331234567',
    program: 'FA',
    message: 'What is the fee structure for FA?',
    processed: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@example.com',
    phone: '03441234567',
    program: 'FSc Pre-Engineering',
    message: 'How to apply for FSc Pre-Engineering?',
    processed: false,
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
];

const subscribers = [
  { email: 'ali.raza@example.com', subscribedAt: new Date(Date.now() - 86400000 * 2) },
  { email: 'fatima.noor@example.com', subscribedAt: new Date(Date.now() - 86400000 * 5) },
  { email: 'usman.khan@example.com', subscribedAt: new Date(Date.now() - 86400000 * 1) },
  { email: 'ayesha.siddiqui@example.com', subscribedAt: new Date(Date.now() - 86400000 * 3) },
  { email: 'bilal.ahmed@example.com', subscribedAt: new Date(Date.now() - 86400000 * 4) },
];

const contactMessages = [
  {
    name: 'Ali Raza',
    email: 'ali.raza@example.com',
    message: 'I want to know more about your school.',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@example.com',
    message: 'How can I contact the admissions office?',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    name: 'Usman Khan',
    email: 'usman.khan@example.com',
    message: 'Is there a scholarship program?',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@example.com',
    message: 'What are the school timings?',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@example.com',
    message: 'How to apply for admission?',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
];

async function seedAll() {
  await connectDB();
  await AdmissionQuery.deleteMany({});
  await AdmissionQuery.insertMany(admissionQueries);
  await Subscriber.deleteMany({});
  await Subscriber.insertMany(subscribers);
  await ContactMessage.deleteMany({});
  await ContactMessage.insertMany(contactMessages);
  console.log('Seeded Admission Queries, Subscribers, and Contact Messages!');
  mongoose.connection.close();
}

seedAll();
