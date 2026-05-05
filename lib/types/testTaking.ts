// TestTakingClient component props
export interface TestTakingClientProps {
  testId: string;
  admissionId?: string;
  classId?: string;
  studentName?: string;
  studentClass?: string;
  isNewStudent?: boolean;
}

// Student info for test taking
export interface TestStudentInfo {
  studentName: string;
  studentClass: string;
  fatherCnic?: string;
}
