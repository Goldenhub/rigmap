import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container max-w-screen-2xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900">DeskEnvy</p>
            <p className="text-xs text-neutral-500">Discover inspiring workspace setups.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">Built by</span>
            <Link href="https://github.com/goldenhub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <Github className="h-4 w-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-900">goldenhub</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-neutral-100 mt-8 pt-8">
          <p className="text-xs text-neutral-500 text-center">© {new Date().getFullYear()} DeskEnvy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
