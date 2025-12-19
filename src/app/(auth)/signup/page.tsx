"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { Loader2, ArrowLeft } from "lucide-react";
import { PasswordInput } from "@/components/password-input";
import { PasswordValidator } from "@/components/password-validator";

const initialState = {
  error: "",
};

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, initialState);
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors mb-4 group">
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Showcase
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Create account</h1>
        <p className="text-neutral-500 font-medium tracking-tight">Join the community of tech enthusiasts.</p>
      </div>

      <form action={action} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-neutral-600 pl-1">
              Community Handle
            </label>
            <input id="username" name="username" type="text" required className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all" placeholder="setup_master" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-neutral-600 pl-1">
              Email Address
            </label>
            <input id="email" name="email" type="email" required className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all" placeholder="techie@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-neutral-600 pl-1">
              Password
            </label>
            <PasswordInput id="password" name="password" onPasswordChange={setPassword} />
            <PasswordValidator password={password} />
          </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in zoom-in duration-300">
            <p className="text-sm font-bold text-red-600 text-center">{state.error}</p>
          </div>
        )}

        <button type="submit" disabled={isPending} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-8 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:opacity-50">
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Join Community"}
        </button>
      </form>

      <div className="text-center text-sm font-medium text-neutral-500">
        Already a member?{" "}
        <Link href="/login" className="text-neutral-900 hover:text-neutral-700 transition-colors font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
