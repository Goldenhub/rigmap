import Link from 'next/link';
import { getSession, logout } from '@/lib/auth';
import { Monitor, Plus, User as UserIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-black sm:inline-block text-neutral-900 tracking-tight text-xl italic uppercase">
              RigMap
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-semibold">
            <Link
              href="/"
              className="transition-all hover:text-indigo-600 text-neutral-600 px-4 py-1.5 rounded-full hover:bg-indigo-50/50 active:scale-95"
            >
              Showcase
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md px-5 py-2 text-sm font-bold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md hover:border-neutral-300 active:scale-95"
                >
                  <UserIcon className="mr-2 h-4 w-4 text-indigo-500" />
                  My Profile
                </Link>
                <Link
                  href="/new"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Setup
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-neutral-100 ml-2">
                  <span className="text-sm font-bold text-neutral-900 hidden md:block">@{session.user.username}</span>
                  <form
                    action={async () => {
                      'use server';
                      await logout();
                      redirect('/');
                    }}
                  >
                    <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors">
                      Log out
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="text-sm font-bold text-neutral-600 transition-colors hover:text-indigo-600 px-4 py-2"
                >
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95"
                >
                    Join
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
