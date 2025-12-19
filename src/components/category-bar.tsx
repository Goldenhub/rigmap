"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Code2, Tv, LayoutGrid } from "lucide-react";

const categories = [
  { name: "All", icon: LayoutGrid },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Software Development", icon: Code2 },
  { name: "Streaming", icon: Tv },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
];

export function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const currentSort = searchParams.get("sort") || "newest";

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/?${params.toString()}`);
  };

  const handleSortClick = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex items-center justify-center gap-3">
        {/* <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">Sort By:</span> */}
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <button key={option.value} onClick={() => handleSortClick(option.value)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${currentSort === option.value ? "bg-neutral-900 border-neutral-900 text-white shadow-md" : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex justify-center items-center gap-3">
        {/* <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">Category:</span> */}
        <div className="flex items-center flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = (cat.name === "All" && !searchParams.get("category")) || cat.name === currentCategory;

            return (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${isActive ? "bg-neutral-900 border-neutral-900 text-white shadow-md" : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"}`}>
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
