// Contact message type definitions

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  status: 'pending' | 'replied';
  createdAt: string;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  message: string;
}
