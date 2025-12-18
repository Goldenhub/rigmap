'use client';

import Link from 'next/link';
import { Monitor, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toggleSaveWorkspace } from '@/actions/saved';

interface WorkspaceCardProps {
  workspace: {
    id: string;
    title: string;
    imageUrl: string;
    user: {
      username: string;
    };
    _count: {
      devices: number;
    };
    devices?: { price: number | null }[];
  };
  isSavedInitial?: boolean;
  isLoggedIn?: boolean;
}

export function WorkspaceCard({ workspace, isSavedInitial = false, isLoggedIn = false }: WorkspaceCardProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);

  const totalValue = workspace.devices?.reduce((sum, d) => sum + (d.price || 0), 0) || 0;
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    setIsSaving(true);
    const prevSaved = isSaved;
    setIsSaved(!prevSaved);
    
    const result = await toggleSaveWorkspace(workspace.id);
    if (result.error) {
      setIsSaved(prevSaved);
    } else if (result.saved !== undefined) {
      setIsSaved(result.saved);
    }
    setIsSaving(false);
  };

  return (
    <div className="group relative">
      <Link
        href={`/workspace/${workspace.id}`}
        className="block overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
          <img
            src={workspace.imageUrl}
            alt={workspace.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/50 uppercase tracking-widest z-10">
            {formattedValue}
          </div>

          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`absolute top-4 left-4 p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-lg z-20 ${
              isSaved 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20' 
                : 'bg-white/90 text-neutral-900 border-white/50 hover:bg-white opacity-0 group-hover:opacity-100'
            } transition-all duration-300 transform ${isSaved ? 'scale-100 opacity-100' : 'scale-90 group-hover:scale-100'}`}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-neutral-900 font-bold text-lg truncate tracking-tight">{workspace.title}</h3>
            <p className="text-neutral-500 text-xs font-medium">@{workspace.user.username}</p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
              <div className="p-1 bg-neutral-100 rounded-md">
                  <Monitor className="h-3 w-3 text-indigo-500" />
              </div>
              <span>{workspace._count.devices} Items</span>
            </div>
            <span className="text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-transform uppercase tracking-tighter">
              View Setup &rarr;
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
