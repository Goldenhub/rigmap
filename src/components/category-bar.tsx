'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Gamepad2, 
  Code2, 
  Tv, 
  Sparkles, 
  Flame, 
  LayoutGrid 
} from 'lucide-react';

const categories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'New', icon: Sparkles },
  { name: 'Most Liked', icon: Flame },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Software Development', icon: Code2 },
  { name: 'Streaming', icon: Tv },
];

export function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || (currentCategory === 'Most Liked' ? 'popular' : 'newest');

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'All') {
      params.delete('category');
    } else if (category === 'Most Liked') {
      params.delete('category');
      params.set('sort', 'popular');
    } else if (category === 'New') {
      params.delete('category');
      params.set('sort', 'newest');
    } else {
      params.set('category', category);
      params.delete('sort'); // Reset sort when changing category
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center w-full overflow-x-auto no-scrollbar py-6">
      <div className="flex gap-2 px-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = 
            (cat.name === 'All' && !searchParams.get('category') && (!searchParams.get('sort'))) ||
            (cat.name === 'New' && searchParams.get('sort') === 'newest' && !searchParams.get('category')) ||
            (cat.name === 'Most Liked' && searchParams.get('sort') === 'popular') ||
            (cat.name === currentCategory && cat.name !== 'Most Liked' && cat.name !== 'New' && cat.name !== 'All');

          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-neutral-900 border-neutral-900 text-white shadow-md'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
