"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`transition-colors ${isActive ? "text-neutral-900 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}>
      {label}
    </Link>
  );
}
