import Link from 'next/link';
import { getSession, logout } from '@/lib/auth';
import { Monitor, Plus, User as UserIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-neutral-900 p-1.5 rounded-lg transition-transform group-hover:scale-105">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-neutral-900 tracking-tight text-xl uppercase">
              RigMap
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Discover</Link>
            {/* <Link href="/browse" className="hover:text-neutral-900 transition-colors">Browse</Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/new"
                className="hidden sm:flex h-9 items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:bg-neutral-800 active:scale-95"
              >
                <Plus size={16} className="mr-2" />
                Post Rig
              </Link>
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
              >
                <UserIcon size={18} />
              </Link>
              <form
                action={async () => {
                  'use server';
                  await logout();
                  redirect('/');
                }}
              >
                <button className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex h-9 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-all hover:bg-neutral-800"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
