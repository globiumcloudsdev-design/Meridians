export interface LibraryItem {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  pdfUrl: string;
  createdAt: string;
}

export interface LibraryFormValues {
  title: string;
  thumbnail: string;
  description: string;
}
