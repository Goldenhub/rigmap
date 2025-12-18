import getDb from '@/lib/db';
import WorkspaceViewer from '@/components/workspace-viewer';
import { Calendar, User, ExternalLink, Trophy } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getSavedStatus } from '@/actions/saved';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceDetailPage(props: PageProps) {
  const { id } = await props.params;
  const db = getDb;
  
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

  const totalValue = workspace.devices.reduce((sum: number, d: any) => sum + (d.price || 0), 0);
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);

  return (
    <div className="container py-10 max-w-screen-xl mx-auto px-4 space-y-12">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[0.9]">{workspace.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-neutral-500">
           <div className="flex items-center gap-2 group cursor-default">
               <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                 <User className="h-4 w-4 text-indigo-600" />
               </div>
               <span>Posted by <span className="text-neutral-900">@{workspace.user.username}</span></span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full">
               <Calendar className="h-4 w-4 text-neutral-400" />
               <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
           </div>
            <div className="flex items-center gap-2">
                <div className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/25">
                   Total Value: {formattedValue}
                </div>
            </div>
        </div>
      </div>

      <WorkspaceViewer workspaceId={id} imageUrl={workspace.imageUrl} devices={workspace.devices} isSavedInitial={isSaved} />

      {workspace.description && (
        <div className="glass-card rounded-3xl p-8 max-w-4xl">
           <h3 className="text-xl font-black text-neutral-900 mb-4 italic uppercase tracking-tighter">About this setup</h3>
           <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap font-medium">{workspace.description}</p>
        </div>
      )}

      {/* Device List Backup */}
      <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-neutral-900 italic uppercase tracking-tighter">Gear List</h3>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspace.devices.map((device: any) => (
                  <div key={device.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                          <h4 className="font-extrabold text-neutral-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{device.name}</h4>
                          {device.link && (
                              <a href={device.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                  <ExternalLink className="h-4 w-4" />
                              </a>
                          )}
                      </div>
                      {device.description && <p className="text-sm text-neutral-500 font-medium mb-4 leading-relaxed">{device.description}</p>}
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg">
                          <span className="text-indigo-600 font-black text-sm tracking-tight">
                              {device.price ? `$${device.price.toLocaleString()}` : 'Priceless'}
                          </span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
