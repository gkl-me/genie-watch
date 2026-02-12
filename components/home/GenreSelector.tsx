import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Genre {
  id: number;
  name: string;
}

interface GenreSelectorProps {
  selectedGenres: number[];
  onToggleGenre: (id: number) => void;
}

export function GenreSelector({ selectedGenres, onToggleGenre, existingGenres = [] }: GenreSelectorProps & { existingGenres: Genre[] }) {
  const [genres] = useState<Genre[]>(existingGenres);

  // No useEffect needed anymore since we pass data from server


  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-muted-foreground">Select Genres</h2>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <motion.button
              key={genre.id}
              onClick={() => onToggleGenre(genre.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                isSelected
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              {genre.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
