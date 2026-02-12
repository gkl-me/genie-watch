'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FindButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function FindButton({ onClick, disabled }: FindButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full group overflow-hidden bg-white text-black font-bold py-4 px-8 rounded-xl text-xl tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <span className="relative flex items-center justify-center gap-3">
        <Sparkles className="w-6 h-6 animate-pulse" />
        Find My Movie
        <Sparkles className="w-6 h-6 animate-pulse" />
      </span>
    </motion.button>
  );
}
