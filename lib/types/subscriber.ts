// Subscriber type definitions

export interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
}

export interface CreateSubscriberInput {
  email: string;
}
