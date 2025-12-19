import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { WorkspaceCard } from '@/components/workspace-card';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Heart, Layout, ArrowRight, Edit } from 'lucide-react';

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
          likes: true,
        },
      },
      likes: {
        where: { userId: session.user.id }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const likedWorkspaces = await db.like.findMany({
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
              likes: true,
            },
          },
          likes: {
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
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-16 max-w-screen-2xl mx-auto px-4 space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-neutral-200">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-neutral-900 tracking-tight">
              Profile <span className="text-neutral-400">/ {session.user.username}</span>
            </h1>
            <p className="text-neutral-500 font-medium">Manage your published setups and liked rigs.</p>
          </div>
          <Link
            href="/new"
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 w-fit active:scale-95 group"
          >
            <Plus className="h-5 w-5" />
            Post New Rig
          </Link>
        </div>

        {/* My Rigs Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                My Published Rigs ({userWorkspaces.length})
              </h2>
              <div className="h-px flex-1 bg-neutral-200" />
          </div>
          
          {userWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl text-center border-dashed border-2 border-neutral-100">
              <Plus className="h-10 w-10 text-neutral-200 mb-6" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Ready to inspire?</h3>
              <p className="max-w-md text-neutral-500 font-medium mb-8">
                Share your rig details and map your gear for others to see.
              </p>
              <Link
                href="/new"
                className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                Post your first rig <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {userWorkspaces.map((workspace: any) => (
                <div key={workspace.id} className="relative group">
                  <WorkspaceCard 
                    workspace={workspace} 
                    isLikedInitial={workspace.likes?.length > 0} 
                    isLoggedIn={true} 
                  />
                  <div className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 transition-all z-30">
                     <Link 
                       href={`/workspace/${workspace.id}/edit`}
                       className="bg-white rounded-full inline-flex items-center justify-center h-8 w-8 border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                     >
                       <Edit size={14} />
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liked Rigs Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Liked Rigs ({likedWorkspaces.length})
              </h2>
              <div className="h-px flex-1 bg-neutral-200" />
          </div>
          
          {likedWorkspaces.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl text-center border border-neutral-100 border-dashed">
               <Heart className="h-12 w-12 text-neutral-200 mb-4" />
               <p className="text-neutral-500 font-medium max-w-sm">
                 No liked rigs yet. Explore the showcase and find setups you love!
               </p>
               <Link href="/" className="mt-6 text-neutral-900 font-bold hover:underline">
                 Explore Rigs &rarr;
               </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {likedWorkspaces.map((liked: any) => (
                <WorkspaceCard 
                  key={liked.workspace.id} 
                  workspace={liked.workspace} 
                  isLikedInitial={true}
                  isLoggedIn={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
