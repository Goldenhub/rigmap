"use client";

import Link from "next/link";
import { ArrowRight, Grid3x3, Gamepad2, Code2, Tv } from "lucide-react";

interface CategoryCardProps {
  category: {
    name: string;
    iconName: string;
    description: string;
    count: number;
  };
  isActive: boolean;
  href: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  grid: Grid3x3,
  gamepad: Gamepad2,
  code: Code2,
  tv: Tv,
};

export function CategoryCard({ category, isActive, href }: CategoryCardProps) {
  const Icon = iconMap[category.iconName] || Grid3x3;

  return (
    <Link href={href}>
      <div className={`p-6 rounded-2xl border-2 transition-all text-left group hover:scale-105 cursor-pointer ${isActive ? "bg-neutral-900 border-neutral-900 text-white shadow-lg" : "bg-white border-neutral-200 text-neutral-900 hover:border-neutral-900"}`}>
        <div className={`p-3 rounded-xl w-fit mb-4 transition-all ${isActive ? "bg-white/20" : "bg-neutral-100"}`}>
          <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-neutral-900"}`} />
        </div>
        <h3 className="text-lg font-bold mb-1">{category.name}</h3>
        <p className={`text-sm mb-4 ${isActive ? "text-white/80" : "text-neutral-600"}`}>{category.description}</p>
        <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-900"}`}>
          {category.count} rigs
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
