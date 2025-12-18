import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { WorkspaceCard } from '@/components/workspace-card';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Bookmark, Layout, ArrowRight, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const userWorkspaces = await db.workspace.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        select: { username: true },
      },
      devices: {
        select: { price: true },
      },
      _count: {
        select: { 
          devices: true,
          savedBy: true
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const savedWorkspaces = await db.savedWorkspace.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      workspace: {
        include: {
          user: {
            select: { username: true },
          },
          devices: {
            select: { price: true },
          },
          _count: {
            select: { 
              devices: true,
              savedBy: true
            },
          },
          savedBy: {
            where: { userId: session.user.id }
          }
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container py-10 max-w-screen-2xl mx-auto px-4 space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-100/50">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
             Creator Dashboard
          </div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none italic uppercase">
            Profile <span className="text-gradient">/{session.user.username}</span>
          </h1>
        </div>
        <Link
          href="/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 w-fit active:scale-95 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          POST NEW SETUP
        </Link>
      </div>

      {/* My Rigs Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-50 rounded-xl">
               <Layout className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 italic uppercase tracking-tighter">
              My Published Rigs ({userWorkspaces.length})
            </h2>
            <div className="h-px flex-1 bg-neutral-100" />
        </div>
        
        {userWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 glass-card rounded-[3rem] text-center border-dashed border-2 border-neutral-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Plus className="h-10 w-10 text-indigo-200" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Ready to inspire the community?</h3>
            <p className="max-w-md text-neutral-500 font-medium mb-8">
              Share your rig details and map your gear for others to see. It only takes a few minutes.
            </p>
            <Link
              href="/new"
              className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              Post your first setup <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {userWorkspaces.map((workspace: any) => (
              <div key={workspace.id} className="relative group">
                <WorkspaceCard workspace={workspace} isSavedInitial={workspace.savedBy?.length > 0} isLoggedIn={true} />
                <div className="absolute top-20 left-4 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 z-30">
                   <Link 
                     href={`/workspace/${workspace.id}/edit`}
                     className="bg-white/90 rounded-2xl inline-flex items-center justify-center p-2 border border-white/50 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl ring-1 ring-black/5"
                   >
                     <Edit className="h-5 w-5" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Rigs Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-violet-50 rounded-xl">
               <Bookmark className="h-5 w-5 text-violet-600" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 italic uppercase tracking-tighter">
              Saved for Inspiration ({savedWorkspaces.length})
            </h2>
            <div className="h-px flex-1 bg-neutral-100" />
        </div>
        
        {savedWorkspaces.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 px-6 bg-neutral-50/50 rounded-[3rem] text-center border border-neutral-100">
             <Bookmark className="h-12 w-12 text-neutral-200 mb-4" />
             <p className="text-neutral-500 font-medium max-w-sm">
               No saved rigs yet. Explore the showcase and bookmark setups you love!
             </p>
             <Link href="/#explore" className="mt-6 text-indigo-600 font-bold hover:underline">
               Explore Rigs &rarr;
             </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedWorkspaces.map((saved: any) => (
              <WorkspaceCard 
                key={saved.workspace.id} 
                workspace={saved.workspace} 
                isSavedInitial={true}
                isLoggedIn={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
