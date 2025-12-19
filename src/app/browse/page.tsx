import db from "@/lib/db";
import { WorkspaceCard } from "@/components/workspace-card";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { CategoryCard } from "@/components/category-card";

export const dynamic = "force-dynamic";

interface BrowseProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const categoryConfig = [
  { name: "All", iconName: "grid", description: "Explore all workspace setups" },
  { name: "Gaming", iconName: "gamepad", description: "High-performance gaming rigs" },
  { name: "Software Development", iconName: "code", description: "Dev-focused workspaces" },
  { name: "Streaming", iconName: "tv", description: "Content creator setups" },
];

export default async function BrowsePage({ searchParams }: BrowseProps) {
  const { category } = await searchParams;
  const session = await getSession();
  const selectedCategory = category || "All";

  // First, get all user IDs to filter out orphaned workspaces
  const validUserIds = (await db.user.findMany({ select: { id: true } })).map((u) => u.id);

  // Get categories with counts
  const categories = await Promise.all(
    categoryConfig.map(async (cat) => {
      const count = await db.workspace.count({
        where: {
          userId: { in: validUserIds },
          ...(cat.name !== "All" ? { category: cat.name } : {}),
        },
      });
      return { ...cat, count };
    })
  );

  // Get workspaces for selected category
  const workspaces = await db.workspace.findMany({
    where: {
      userId: { in: validUserIds },
      ...(selectedCategory !== "All" ? { category: selectedCategory } : {}),
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-2xl mx-auto px-4 space-y-12">
        <BackButton href="/" label="← Back to Discover" />

        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">Browse by Category</h1>
          <p className="max-w-xl text-neutral-500 text-lg">Explore workspace setups organized by type and use case.</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            const href = cat.name === "All" ? "/browse" : `/browse?category=${encodeURIComponent(cat.name)}`;

            return <CategoryCard key={cat.name} category={cat} isActive={isActive} href={href} />;
          })}
        </div>

        {/* Selected Category Results */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">{selectedCategory === "All" ? "All Rigs" : `${selectedCategory} Rigs`}</h2>
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-sm font-medium text-neutral-500">{workspaces.length} items</span>
          </div>

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
