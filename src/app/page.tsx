import db from "@/lib/db";
import type { Prisma } from "../../generated/prisma/client";
import { WorkspaceCard } from "@/components/workspace-card";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { CategoryBar } from "@/components/category-bar";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{
    sort?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { sort, category } = await searchParams;
  const session = await getSession();

  // First, get all user IDs to filter out orphaned workspaces
  const validUserIds = (await db.user.findMany({ select: { id: true } })).map((u) => u.id);

  const workspaces = await db.workspace.findMany({
    where: {
      userId: { in: validUserIds }, // Only get workspaces with valid users
      ...(category && category !== "All" ? { category } : {}),
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
          savedBy: true,
        },
      },
      likes: session
        ? {
            where: { userId: session.user.id },
          }
        : false,
    },
    orderBy: (sort === "popular" ? { likes: { _count: "desc" as const } } : { createdAt: "desc" as const }) as Prisma.WorkspaceOrderByWithRelationInput,
  });

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-2xl mx-auto px-4 space-y-12">
        <div className="flex flex-col items-center text-center space-y-4 pt-16 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
            Discover well-designed <br />
            <span className="text-neutral-400">workspace setups.</span>
          </h1>
          <p className="max-w-xl text-neutral-500 text-lg">A curated gallery of the world&apos;s most inspiring desk setups and creative spaces.</p>

          {!session && (
            <div className="pt-4">
              <Link href="/signup" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 rounded-full font-medium transition-all">
                Join the community
              </Link>
            </div>
          )}
        </div>

        <div className="sticky top-16 z-40 bg-[#F5F5F7]/80 backdrop-blur-md -mx-4 px-4 border-b border-neutral-200/50">
          <CategoryBar />
        </div>

        <div id="explore" className="space-y-10">
          {workspaces.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
              <p className="text-neutral-500 font-medium">No rigs found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {workspaces.map((workspace: any) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} isLikedInitial={workspace.likes?.length > 0} isLoggedIn={!!session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
