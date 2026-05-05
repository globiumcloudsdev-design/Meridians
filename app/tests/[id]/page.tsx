import TestTakingClient from "./TestTakingClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ admissionId?: string; studentName?: string; class?: string }>;
}

export default async function TestTakingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { admissionId, studentName, class: studentClass } = await searchParams;

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600">Invalid test ID</p>
      </div>
    );
  }

  // Case 1: New student with new test entry and student info
  if (id === 'new' && studentName && studentClass) {
    return (
      <TestTakingClient 
        testId="pending" 
        studentName={studentName}
        studentClass={studentClass}
        isNewStudent={true} 
      />
    );
  }

  // Case 2: Existing student with admission ID
  if (!admissionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600">Invalid admission ID or student info</p>
      </div>
    );
  }

  return <TestTakingClient testId={id} admissionId={admissionId} isNewStudent={false} />;
}
