export interface IPoster {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePosterInput {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  isActive?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

export interface UpdatePosterInput extends Partial<CreatePosterInput> {}
