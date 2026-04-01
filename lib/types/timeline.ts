export interface TimelineEvent {
  _id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTimelineEventInput {
  title: string;
  date: string;
  description: string;
  icon: string;
  order: number;
}

export interface UpdateTimelineEventInput extends Partial<CreateTimelineEventInput> {}
