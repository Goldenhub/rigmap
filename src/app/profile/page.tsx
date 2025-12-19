import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { WorkspaceCard } from "@/components/workspace-card";
import { BackButton } from "@/components/back-button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Heart, ArrowRight, Edit, Bookmark } from "lucide-react";
import { ProfileMainTabs } from "@/components/profile-main-tabs";
import { ProfileTabs } from "@/components/profile-tabs";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
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
        where: { userId: session.user.id },
      },
    },
    orderBy: {
      createdAt: "desc",
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
            where: { userId: session.user.id },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get saved workspaces
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
              likes: true,
            },
          },
          likes: {
            where: { userId: session.user.id },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get saved devices
  const savedDevices = await db.savedDevice.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      device: {
        include: {
          workspace: {
            select: {
              id: true,
              title: true,
              user: {
                select: { username: true },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get liked devices
  const likedDevices = await db.deviceLike.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      device: {
        include: {
          workspace: {
            select: {
              id: true,
              title: true,
              user: {
                select: { username: true },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container py-12 max-w-screen-2xl mx-auto px-4 space-y-12">
        <BackButton href="/" label="← Back to Explore" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-neutral-200">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">
              Profile <span className="text-neutral-400">/ {session.user.username}</span>
            </h1>
            <p className="text-neutral-500 font-medium">Manage your published setups and gear collection.</p>
          </div>
          <Link href="/new" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 w-fit active:scale-95 group">
            <Plus className="h-5 w-5" />
            Post New Rig
          </Link>
        </div>

        {/* Main Tabs: Published, Saved, Likes */}
        <ProfileMainTabs
          publishedSection={
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">My Published Rigs</h2>
                <p className="text-sm text-neutral-500">{userWorkspaces.length} rigs published</p>
              </div>

              {userWorkspaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl text-center border-dashed border-2 border-neutral-100">
                  <Plus className="h-10 w-10 text-neutral-200 mb-6" />
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Ready to inspire?</h3>
                  <p className="max-w-md text-neutral-500 font-medium mb-8">Share your rig details and map your gear for others to see.</p>
                  <Link href="/new" className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center gap-2">
                    Post your first rig <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {userWorkspaces.map((workspace: any) => (
                    <div key={workspace.id} className="relative group">
                      <WorkspaceCard workspace={workspace} isLikedInitial={workspace.likes?.length > 0} isLoggedIn={true} />
                      <div className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 transition-all z-30">
                        <Link href={`/workspace/${workspace.id}/edit`} className="bg-white rounded-full inline-flex items-center justify-center h-8 w-8 border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                          <Edit size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
          savedSection={
            <ProfileTabs
              rigsSection={
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Saved Rigs</h2>
                    <p className="text-sm text-neutral-500">{savedWorkspaces.length} rigs saved</p>
                  </div>

                  {savedWorkspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl text-center border border-neutral-100 border-dashed">
                      <Bookmark className="h-12 w-12 text-neutral-200 mb-4" />
                      <p className="text-neutral-500 font-medium max-w-sm">No saved rigs yet. Explore and bookmark your favorite setups!</p>
                      <Link href="/" className="mt-6 text-neutral-900 font-bold hover:underline">
                        Explore Rigs &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {savedWorkspaces.map((saved: any) => (
                        <WorkspaceCard key={saved.workspace.id} workspace={saved.workspace} isLikedInitial={saved.workspace.likes?.length > 0} isLoggedIn={true} />
                      ))}
                    </div>
                  )}
                </div>
              }
              gearsSection={
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Saved Gear</h2>
                    <p className="text-sm text-neutral-500">{savedDevices.length} items saved</p>
                  </div>

                  {savedDevices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl text-center border border-neutral-100 border-dashed">
                      <Bookmark className="h-12 w-12 text-neutral-200 mb-4" />
                      <p className="text-neutral-500 font-medium max-w-sm">No saved gear yet. Explore rigs and bookmark your favorite devices!</p>
                      <Link href="/" className="mt-6 text-neutral-900 font-bold hover:underline">
                        Explore Rigs &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedDevices.map((saved: any) => (
                        <Link key={saved.device.id} href={`/workspace/${saved.device.workspaceId}`} className="group">
                          <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-all h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-neutral-900 group-hover:text-neutral-700">{saved.device.name}</h3>
                                <p className="text-xs text-neutral-500 mt-1">From: {saved.device.workspace.title}</p>
                              </div>
                              <Bookmark className="h-5 w-5 text-indigo-600" fill="currentColor" />
                            </div>
                            {saved.device.description && <p className="text-sm text-neutral-600 font-medium mb-3 line-clamp-2">{saved.device.description}</p>}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg">
                              <span className="text-neutral-900 font-bold text-sm">{saved.device.price ? `$${saved.device.price.toLocaleString()}` : "Custom"}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          }
          likesSection={
            <ProfileTabs
              rigsSection={
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Liked Rigs</h2>
                    <p className="text-sm text-neutral-500">{likedWorkspaces.length} rigs liked</p>
                  </div>

                  {likedWorkspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl text-center border border-neutral-100 border-dashed">
                      <Heart className="h-12 w-12 text-neutral-200 mb-4" />
                      <p className="text-neutral-500 font-medium max-w-sm">No liked rigs yet. Explore and find setups you love!</p>
                      <Link href="/" className="mt-6 text-neutral-900 font-bold hover:underline">
                        Explore Rigs &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {likedWorkspaces.map((liked: any) => (
                        <WorkspaceCard key={liked.workspace.id} workspace={liked.workspace} isLikedInitial={true} isLoggedIn={true} />
                      ))}
                    </div>
                  )}
                </div>
              }
              gearsSection={
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Liked Gear</h2>
                    <p className="text-sm text-neutral-500">{likedDevices.length} items liked</p>
                  </div>

                  {likedDevices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl text-center border border-neutral-100 border-dashed">
                      <Heart className="h-12 w-12 text-neutral-200 mb-4" />
                      <p className="text-neutral-500 font-medium max-w-sm">No liked gear yet. Interact with devices to like them!</p>
                      <Link href="/" className="mt-6 text-neutral-900 font-bold hover:underline">
                        Explore Rigs &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedDevices.map((liked: any) => (
                        <Link key={liked.device.id} href={`/workspace/${liked.device.workspaceId}`} className="group">
                          <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-all h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-neutral-900 group-hover:text-neutral-700">{liked.device.name}</h3>
                                <p className="text-xs text-neutral-500 mt-1">From: {liked.device.workspace.title}</p>
                              </div>
                              <Heart className="h-5 w-5 text-red-600" fill="currentColor" />
                            </div>
                            {liked.device.description && <p className="text-sm text-neutral-600 font-medium mb-3 line-clamp-2">{liked.device.description}</p>}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg">
                              <span className="text-neutral-900 font-bold text-sm">{liked.device.price ? `$${liked.device.price.toLocaleString()}` : "Custom"}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          }
        />
      </div>
    </div>
  );
}
