
import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env.local') });
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/db';

async function seedAdmin() {
  await connectDB();
  const email = 'admin@meridians.com';
  const password = 'admin123'; // Change this after first login!
  const role = 'admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    return;
  }

  const hashed = await bcryptjs.hash(password, 10);
  await User.create({ email, password: hashed, role });
  console.log('Admin user created:', email);
}

seedAdmin().then(() => {
  mongoose.connection.close();
});
