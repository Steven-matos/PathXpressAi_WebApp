import DashboardClient from './DashboardClient';

export default async function DashboardUserPage({ params }: { params: { userId: string } }) {
  // In Next.js App Router, we need to await the params object before using its properties
  const resolvedParams = await Promise.resolve(params);
  const userId = resolvedParams.userId;
  
  return <DashboardClient userId={userId} />;
}
