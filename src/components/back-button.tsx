"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors group">
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </Link>
  );
}
