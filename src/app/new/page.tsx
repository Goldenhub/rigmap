import WorkspaceEditor from '@/components/workspace-editor';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewWorkspacePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container py-10 max-w-screen-xl mx-auto">
      <WorkspaceEditor />
    </div>
  );
}
