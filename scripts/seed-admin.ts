
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../lib/models/User';
import { connectDB } from '../lib/db';

async function seedAdmin() {
  await connectDB();
  const email = 'admin@meridians.com';
  const password = 'admin123'; // Change this after first login!
  const role = 'admin';

  const existing = await User.findOne({ email });
  const hashed = await bcryptjs.hash(password, 10);

  if (existing) {
    existing.password = hashed;
    existing.role = role;
    await existing.save();
    console.log('Admin user updated:', email);
  } else {
    await User.create({ email, password: hashed, role });
    console.log('Admin user created:', email);
  }
}

seedAdmin().then(() => {
  mongoose.connection.close();
});
