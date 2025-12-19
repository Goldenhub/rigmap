import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';
import WorkspaceEditor from '@/components/workspace-editor';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkspacePage(props: PageProps) {
  const { id } = await props.params;
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const db = getDb;
  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      devices: true,
    },
  });

  if (!workspace) {
    notFound();
  }

  // Verify ownership
  if (workspace.userId !== session.user.id) {
    redirect('/profile');
  }

  // Pre-process devices to match the string price requirement in the editor
  const formattedDevices = workspace.devices.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description || '',
    xPercent: d.xPercent,
    yPercent: d.yPercent,
    price: d.price?.toString() || '',
    link: d.link || '',
  }));

  const initialData = {
    id: workspace.id,
    title: workspace.title,
    description: workspace.description || '',
    imageUrl: workspace.imageUrl,
    devices: formattedDevices,
    category: workspace.category,
  };

  return (
    <div className="container py-10 max-w-screen-xl mx-auto px-4">
      <WorkspaceEditor initialData={initialData} />
    </div>
  );
}
