'use client';

import Link from 'next/link';
import { Monitor, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toggleLikeWorkspace } from '@/actions/workspace';

interface WorkspaceCardProps {
  workspace: {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    user: {
      username: string;
    };
    _count: {
      devices: number;
      likes: number;
    };
    devices?: { price: number | null }[];
  };
  isLikedInitial?: boolean;
  isLoggedIn?: boolean;
}

export function WorkspaceCard({ workspace, isLikedInitial = false, isLoggedIn = false }: WorkspaceCardProps) {
  const [isLiked, setIsLiked] = useState(isLikedInitial);
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(workspace._count.likes);

  const totalValue = workspace.devices?.reduce((sum, d) => sum + (d.price || 0), 0) || 0;
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    setIsLiking(true);
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);
    
    const result = await toggleLikeWorkspace(workspace.id);
    if (result.error) {
      setIsLiked(prevLiked);
      setLikesCount(prev => prevLiked ? prev + 1 : prev - 1);
    } else if (result.liked !== undefined) {
      setIsLiked(result.liked);
    }
    setIsLiking(false);
  };

  return (
    <div className="group premium-card flex flex-col h-full bg-white transition-all duration-500">
      <Link href={`/workspace/${workspace.id}`} className="relative block aspect-[4/3] overflow-hidden bg-white">
        <img
          src={workspace.imageUrl}
          alt={workspace.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-neutral-200/50">
             {workspace.category}
          </div>
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-neutral-200/50 text-neutral-900">
            <ExternalLink size={14} />
          </div>
        </div>

        <button
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isLiked 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-white/90 text-neutral-600 border-neutral-200/50 hover:bg-white hover:text-red-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          {isLiking ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart size={14} className={isLiked ? 'fill-current' : ''} />
          )}
          <span className="text-xs font-bold leading-none">{likesCount}</span>
        </button>
      </Link>
      
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/workspace/${workspace.id}`} className="hover:text-neutral-500 transition-colors">
              <h3 className="text-neutral-900 font-bold text-lg tracking-tight leading-tight">{workspace.title}</h3>
            </Link>
            <span className="text-neutral-400 text-xs font-medium whitespace-nowrap">{formattedValue}</span>
          </div>
          <p className="text-neutral-400 text-sm font-medium">by <span className="text-neutral-600">@{workspace.user.username}</span></p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Monitor size={14} />
            <span>{workspace._count.devices} items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
