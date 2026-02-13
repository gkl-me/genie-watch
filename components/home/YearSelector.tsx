'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface YearSelectorProps {
  gteYear: number | null;
  lteYear: number | null;
  onChange: (gte: number | null, lte: number | null) => void;
}

export function YearSelector({ gteYear, lteYear, onChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gteYear && lteYear && gteYear > lteYear) {
      setError("'From' year cannot be greater than 'To' year");
    } else {
      setError(null);
    }
  }, [gteYear, lteYear]);

  const handleYearChange = (type: 'gte' | 'lte', value: string) => {
    if (value === '') {
      onChange(type === 'gte' ? null : gteYear, type === 'lte' ? null : lteYear);
      return;
    }

    const year = parseInt(value);
    if (!isNaN(year)) {
      if (type === 'gte') onChange(year, lteYear);
      else onChange(gteYear, year);
    }
  };

  const stepYear = (type: 'gte' | 'lte', direction: 'prev' | 'next') => {
    const currentVal = type === 'gte' ? gteYear : lteYear;
    const baseYear = currentVal || currentYear;
    const newVal = direction === 'next' ? baseYear + 1 : baseYear - 1;
    
    if (type === 'gte') onChange(newVal, lteYear);
    else onChange(gteYear, newVal);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Year Range
        </h2>
        <button 
          onClick={() => onChange(null, null)}
          className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Released After (GTE) */}
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            From <span className="text-[10px] opacity-50 uppercase tracking-widest">(After)</span>
          </label>
          <div className={clsx(
            "flex items-center bg-white/5 border rounded-2xl overflow-hidden transition-all group",
            gteYear ? "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "border-white/10 hover:border-white/20",
            error && "border-red-500/50"
          )}>
            <button
              onClick={() => stepYear('gte', 'prev')}
              className="p-3 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={gteYear || ''}
              onChange={(e) => handleYearChange('gte', e.target.value)}
              placeholder="Any"
              className="w-full bg-transparent text-center font-mono font-bold text-lg focus:outline-none placeholder:text-muted-foreground/30 py-3"
            />
            <button
              onClick={() => stepYear('gte', 'next')}
              className="p-3 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Released Before (LTE) */}
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            To <span className="text-[10px] opacity-50 uppercase tracking-widest">(Before)</span>
          </label>
          <div className={clsx(
            "flex items-center bg-white/5 border rounded-2xl overflow-hidden transition-all group",
            lteYear ? "border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.1)]" : "border-white/10 hover:border-white/20",
            error && "border-red-500/50"
          )}>
            <button
              onClick={() => stepYear('lte', 'prev')}
              className="p-3 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={lteYear || ''}
              onChange={(e) => handleYearChange('lte', e.target.value)}
              placeholder="Any"
              className="w-full bg-transparent text-center font-mono font-bold text-lg focus:outline-none placeholder:text-muted-foreground/30 py-3"
            />
            <button
              onClick={() => stepYear('lte', 'next')}
              className="p-3 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </motion.div>
        ) : (gteYear || lteYear) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-center text-muted-foreground italic bg-white/5 py-2 px-4 rounded-full border border-white/5"
          >
            Finding movies {gteYear && `from ${gteYear}`} {gteYear && lteYear && 'to'} {lteYear && `up to ${lteYear}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
