export interface NoteItem {
  _id: string;
  subject: string;
  description: string;
  class: string | { _id: string; name: string };
  pdfUrl: string;
  createdAt: string;
}

export interface NoteFormValues {
  subject: string;
  description: string;
  classId: string;
}
