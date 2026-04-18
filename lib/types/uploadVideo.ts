// lib/types/uploadVideo.ts

export type VideoStatus = 'active' | 'inactive' | 'draft';

export interface VideoFormData {
  title: string;
  description: string;
  link: string;
  category: string;
  status: VideoStatus;
  author: string;
}

export interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VideoFormData>) => void;
  initialData?: VideoFormData;
}

// Optional: Agar API response ke liye bhi chahiye
export interface VideoResponse {
  _id: any;
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  link: string;
  category: string;
  status: VideoStatus;
  author: string;
}