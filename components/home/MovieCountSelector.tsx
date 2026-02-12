'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MovieCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
}

export function MovieCountSelector({ count, onChange }: MovieCountSelectorProps) {
  const options = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-muted-foreground mr-4">Number of Movies</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
            <motion.button
                key={option}
                onClick={() => onChange(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                    "w-12 cursor-pointer h-12 rounded-2xl font-bold text-lg transition-all duration-300 border flex items-center justify-center",
                    count === option
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                )}
            >
                {option}
            </motion.button>
        ))}
      </div>
    </div>
  );
}
