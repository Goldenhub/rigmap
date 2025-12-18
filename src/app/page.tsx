import db from '@/lib/db';
import { WorkspaceCard } from '@/components/workspace-card';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { sort } = await searchParams;
  const session = await getSession();
  
  const workspaces = await db.workspace.findMany({
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
      savedBy: session ? {
        where: { userId: session.user.id }
      } : false,
    },
    orderBy: sort === 'popular' 
      ? { savedBy: { _count: 'desc' } }
      : { createdAt: 'desc' },
  });

  return (
    <div className="container py-10 max-w-screen-2xl mx-auto px-4 space-y-10">
      <div className="flex flex-col items-center text-center space-y-6 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Explore the best rigs</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-neutral-900">
           SHOWCASE YOUR <br /> 
           <span className="text-gradient italic">WORKSPACE</span>
        </h1>
        
        <p className="max-w-2xl text-neutral-500 text-lg font-medium leading-relaxed">
          The curated gallery for tech enthusiasts. <br />
          Join the community of makers, designers, and gamers sharing their daily drivers.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href={session ? '/new' : '/signup'}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-500/20 flex items-center gap-2"
          >
            {session ? 'POST YOUR RIG' : 'GET STARTED'}
          </Link>
          <a
            href="#explore"
            className="bg-white hover:bg-neutral-50 text-neutral-800 px-10 py-4 rounded-full font-bold transition-all border border-neutral-200 shadow-sm"
          >
            EXPLORE RIGS
          </a>
        </div>
      </div>

      <div id="explore" className="space-y-10 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-black text-neutral-900 italic uppercase tracking-tighter">
                   Live Showcase
                </h2>
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sort by</span>
               <div className="flex gap-2 p-1 bg-neutral-100 rounded-full border border-neutral-200">
                  <Link 
                    href="/?sort=newest#explore"
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!sort || sort === 'newest' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                  >
                    Newest
                  </Link>
                  <Link 
                    href="/?sort=popular#explore"
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sort === 'popular' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                  >
                    Popular
                  </Link>
               </div>
            </div>
        </div>
        
        {workspaces.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-3xl">
            <p className="text-neutral-500 font-medium">No rigs shared yet. Be the first to start the trend!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {workspaces.map((workspace: any) => (
              <WorkspaceCard 
                key={workspace.id} 
                workspace={workspace} 
                isSavedInitial={workspace.savedBy?.length > 0}
                isLoggedIn={!!session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
