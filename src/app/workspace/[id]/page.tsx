import db from "@/lib/db";
import WorkspaceViewer from "@/components/workspace-viewer";
import { BackButton } from "@/components/back-button";
import { Calendar, User, ExternalLink, Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { getSavedStatus } from "@/actions/saved";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceDetailPage(props: PageProps) {
  const { id } = await props.params;
  const session = await getSession();

  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      user: {
        select: { username: true },
      },
      devices: true,
    },
  });

  if (!workspace) {
    notFound();
  }

  const isSaved = await getSavedStatus(id);

  // Get device likes and saves for current user
  let deviceLikesMap: { [key: string]: boolean } = {};
  let deviceSavesMap: { [key: string]: boolean } = {};

  if (session) {
    const deviceLikes = await db.deviceLike.findMany({
      where: {
        userId: session.user.id,
        deviceId: {
          in: workspace.devices.map((d) => d.id),
        },
      },
      select: { deviceId: true },
    });

    const deviceSaves = await db.savedDevice.findMany({
      where: {
        userId: session.user.id,
        deviceId: {
          in: workspace.devices.map((d) => d.id),
        },
      },
      select: { deviceId: true },
    });

    deviceLikes.forEach((like) => {
      deviceLikesMap[like.deviceId] = true;
    });

    deviceSaves.forEach((save) => {
      deviceSavesMap[save.deviceId] = true;
    });
  }

  const totalValue = workspace.devices.reduce((sum: number, d: any) => sum + (d.price || 0), 0);
  const formattedValue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalValue);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-xl mx-auto px-4 space-y-12">
        <BackButton href="/browse" label="← Back to Rigs" />

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">{workspace.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              <span>
                By <span className="text-neutral-900">@{workspace.user.username}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-full text-xs font-bold">
              <Trophy className="h-4 w-4 text-neutral-400" />
              Total Value: {formattedValue}
            </div>
          </div>
        </div>

        <div>
          <WorkspaceViewer workspaceId={id} imageUrl={workspace.imageUrl} devices={workspace.devices} isSavedInitial={isSaved} isLoggedIn={!!session} deviceLikesInitial={deviceLikesMap} deviceSavesInitial={deviceSavesMap} />
        </div>

        {workspace.description && (
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">About this setup</h3>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap font-medium">{workspace.description}</p>
          </div>
        )}

        {/* Device List Backup */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Gear List</h3>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspace.devices.map((device: any) => (
              <div key={device.id} className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-neutral-900 text-lg tracking-tight group-hover:text-neutral-700 transition-colors">{device.name}</h4>
                  {device.link && (
                    <a href={device.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-900 hover:text-white transition-all">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {device.description && <p className="text-sm text-neutral-600 font-medium mb-4 leading-relaxed">{device.description}</p>}

                {/* Features */}
                {device.features && device.features.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Features</p>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      {device.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-neutral-400 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg">
                  <span className="text-neutral-900 font-bold text-sm">{device.price ? `$${device.price.toLocaleString()}` : "Priceless"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
