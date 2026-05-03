import TestTakingClient from "./TestTakingClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function TestTakingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600">Invalid test ID</p>
      </div>
    );
  }

  return <TestTakingClient testId={id} token={token} />;
}
