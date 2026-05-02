import TestTakingClient from "@/components/TestTakingClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function TestTakingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;
  return <TestTakingClient testId={id} token={token} />;
}
