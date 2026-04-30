import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF file is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Library || mongoose.model('Library', LibrarySchema);
