import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import WorkspaceEditor from "@/components/workspace-editor";
import { BackButton } from "@/components/back-button";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkspacePage(props: PageProps) {
  const { id } = await props.params;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

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
    redirect("/profile");
  }

  // Pre-process devices to match the string price requirement in the editor
  const formattedDevices = workspace.devices.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description || "",
    features: Array.isArray(d.features) ? d.features : [],
    xPercent: d.xPercent,
    yPercent: d.yPercent,
    price: d.price?.toString() || "",
    link: d.link || "",
  }));

  const initialData = {
    id: workspace.id,
    title: workspace.title,
    description: workspace.description || "",
    imageUrl: workspace.imageUrl,
    devices: formattedDevices,
    category: workspace.category,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-xl mx-auto px-4">
        <BackButton href={`/workspace/${id}`} label="← Back" />

        <div className="mb-12 mt-6">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Edit Rig</h1>
          <p className="text-neutral-500 font-medium">Update your workspace setup details.</p>
        </div>
        <WorkspaceEditor initialData={initialData} />
      </div>
    </div>
  );
}
