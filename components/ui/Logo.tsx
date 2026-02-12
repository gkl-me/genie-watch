import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
         <Clapperboard className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors">
        Genie Watch
      </span>
    </Link>
  );
}
