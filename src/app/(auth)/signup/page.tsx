'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signup } from '@/actions/auth';
import { Loader2, ArrowLeft } from 'lucide-react';

const initialState = {
  error: '',
};

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, initialState);

  return (
    <div className="relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-8 relative">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-indigo-600 transition-colors mb-4 group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Showcase
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 italic uppercase">
            Create <span className="text-gradient">account</span>
          </h1>
          <p className="text-neutral-500 font-medium tracking-tight">Join the community of tech enthusiasts.</p>
        </div>

        <form action={action} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1"
              >
                Community Handle
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="flex h-14 w-full rounded-2xl border border-neutral-100 bg-white/40 backdrop-blur-md px-5 py-2 text-sm text-neutral-900 font-bold placeholder:text-neutral-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="setup_master"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex h-14 w-full rounded-2xl border border-neutral-100 bg-white/40 backdrop-blur-md px-5 py-2 text-sm text-neutral-900 font-bold placeholder:text-neutral-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="techie@example.com"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1"
              >
                Passcode
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex h-14 w-full rounded-2xl border border-neutral-100 bg-white/40 backdrop-blur-md px-5 py-2 text-sm text-neutral-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-sans"
              />
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl animate-in fade-in zoom-in duration-300">
              <p className="text-sm font-bold text-red-500 text-center">
                {state.error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-600 px-8 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-500 hover:scale-[1.01] active:scale-95 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Join Community'
            )}
          </button>
        </form>

        <div className="text-center text-sm font-bold text-neutral-500">
          Already a member?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-400 transition-colors ml-1 underline decoration-2 underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
