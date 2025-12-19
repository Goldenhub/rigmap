"use client";

import { useState } from "react";
import { Layout, Package } from "lucide-react";

interface SubTabsProps {
  rigsSection: React.ReactNode;
  gearsSection: React.ReactNode;
}

export function ProfileTabs({ rigsSection, gearsSection }: SubTabsProps) {
  const [activeTab, setActiveTab] = useState<"rigs" | "gears">("rigs");

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button onClick={() => setActiveTab("rigs")} className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition-all ${activeTab === "rigs" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}>
          <Layout className="h-4 w-4" />
          Rigs
        </button>
        <button onClick={() => setActiveTab("gears")} className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition-all ${activeTab === "gears" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}>
          <Package className="h-4 w-4" />
          Gear
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "rigs" && rigsSection}
        {activeTab === "gears" && gearsSection}
      </div>
    </div>
  );
}
