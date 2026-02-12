'use client';

import { Star } from 'lucide-react';

interface RatingSelectorProps {
  minRating: number;
  maxRating: number; // Kept for interface compatibility but ignored or used for display
  onChange: (min: number, max: number) => void;
}

export function RatingSelector({ minRating, onChange }: RatingSelectorProps) {
  // We only control minRating now. Max is always 10.
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold text-muted-foreground">Minimum Rating</h2>
         <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-mono font-bold text-white">{minRating}</span>
            <span className="text-muted-foreground text-sm">- 10</span>
         </div>
      </div>
      
      <div className="relative h-6 flex items-center">
         <div className="absolute w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                style={{ width: `${(minRating / 10) * 100}%` }}
            />
         </div>
         <input
            type="range"
            min="0"
            max="9.5" // Prevent selecting 10 as min, otherwise range is 10-10
            step="0.5"
            value={minRating}
            onChange={(e) => onChange(Number(e.target.value), 10)}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
         />
         
         {/* Custom Thumb handle visual */}
         <div 
            className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none"
            style={{ left: `calc(${(minRating / 10) * 100}% - 12px)` }}
         />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
