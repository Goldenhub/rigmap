"use client";

import { useState } from "react";
import { BookOpen, Bookmark, Heart } from "lucide-react";

interface ProfileMainTabsProps {
  publishedSection: React.ReactNode;
  savedSection: React.ReactNode;
  likesSection: React.ReactNode;
}

export function ProfileMainTabs({ publishedSection, savedSection, likesSection }: ProfileMainTabsProps) {
  const [activeTab, setActiveTab] = useState<"published" | "saved" | "likes">("published");

  const tabs = [
    { id: "published" as const, label: "Published", icon: BookOpen },
    { id: "saved" as const, label: "Saved", icon: Bookmark },
    { id: "likes" as const, label: "Likes", icon: Heart },
  ];

  return (
    <div className="space-y-10">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 border-b border-neutral-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-widest text-sm border-b-2 transition-all ${activeTab === id ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}>
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "published" && publishedSection}
        {activeTab === "saved" && savedSection}
        {activeTab === "likes" && likesSection}
      </div>
    </div>
  );
}
