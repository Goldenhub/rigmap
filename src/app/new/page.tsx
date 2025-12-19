import WorkspaceEditor from "@/components/workspace-editor";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewWorkspacePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Create New Rig</h1>
          <p className="text-neutral-500 font-medium">Share your workspace setup with the community.</p>
        </div>
        <WorkspaceEditor />
      </div>
    </div>
  );
}
