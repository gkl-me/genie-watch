'use client';

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenreSelector } from '@/components/home/GenreSelector';
import { MovieCountSelector } from '@/components/home/MovieCountSelector';
import { RatingSelector } from '@/components/home/RatingSelector';
import { YearSelector } from '@/components/home/YearSelector';
import { LanguageSelector } from '@/components/home/LanguageSelector';
import { FindButton } from '@/components/home/FindButton';
import { MovieCard } from '@/components/movies/MovieCard';
import { Loader2 } from 'lucide-react';
import { getShownMovies, saveShownMovies } from '@/lib/cacheHelper';
import { toast } from 'sonner';

// Memoize sub-components to prevent re-renders unless their props change
const MemoizedGenreSelector = memo(GenreSelector);
const MemoizedMovieCountSelector = memo(MovieCountSelector);
const MemoizedRatingSelector = memo(RatingSelector);
const MemoizedYearSelector = memo(YearSelector);
const MemoizedLanguageSelector = memo(LanguageSelector);

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  imdbRating: number;
}

interface Genre {
  id: number;
  name: string;
}

interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

interface HomeClientProps {
  initialGenres: Genre[];
  initialLanguages: Language[];
}

export function HomeClient({ initialGenres, initialLanguages }: HomeClientProps) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movieCount, setMovieCount] = useState<number>(5);
  const [minRating, setMinRating] = useState<number>(6.5);
  const [gteYear, setGteYear] = useState<number | null>(null);
  const [lteYear, setLteYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleGenre = useCallback((id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }, []);

  const handleMovieCountChange = useCallback((count: number) => {
    setMovieCount(count);
  }, []);

  const handleRatingChange = useCallback((min: number) => {
    setMinRating(min);
  }, []);

  const handleYearChange = useCallback((gte: number | null, lte: number | null) => {
    setGteYear(gte);
    setLteYear(lte);
  }, []);

  const handleLanguageChange = useCallback((iso: string) => {
    setSelectedLanguage(iso);
  }, []);

  const handleFindMovies = useCallback(async () => {
    setIsLoading(true);
    try {
        const shownMovies = getShownMovies();
        const excludeIds = shownMovies.map(m => m.tmdbId);

        const response = await fetch('/api/movies/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            genres: selectedGenres,
            minRating,
            count: movieCount,
            gteYear,
            lteYear,
            excludeIds,
            language: selectedLanguage,
          }),
        });

      if (!response.ok) throw new Error('Failed to find movies');
      const data = await response.json();
      
      // Save results to cache
      data.forEach((movie: any) => saveShownMovies(movie.id));
      console.log(data)
      
      setMovies(data);
      if(data.length == 0){
        toast.error('No movies found. Please try again!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Genie failed to find movies. Please try again!');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenres, movieCount, minRating, gteYear, lteYear,selectedLanguage]);

  return (
    <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto space-y-16">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Discover Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Favorite Movie
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Select your preferences and let the genie grant your cinematic wish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4 space-y-8 glass p-8 rounded-3xl h-fit sticky top-8"
            >
                <MemoizedGenreSelector 
                    existingGenres={initialGenres}
                    selectedGenres={selectedGenres} 
                    onToggleGenre={toggleGenre} 
                />
                
                <div className="h-px bg-white/10" />

                <MemoizedMovieCountSelector 
                    count={movieCount} 
                    onChange={handleMovieCountChange} 
                />

                <div className="h-px bg-white/10" />

                <MemoizedRatingSelector 
                    minRating={minRating} 
                    maxRating={10} 
                    onChange={handleRatingChange} 
                />

                <div className="h-px bg-white/10" />

                <MemoizedLanguageSelector 
                    languages={initialLanguages}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                />
                <div className="h-px bg-white/10" />

                <MemoizedYearSelector 
                    gteYear={gteYear} 
                    lteYear={lteYear} 
                    onChange={handleYearChange} 
                />


                <div className="pt-8 text-center">
                    <FindButton 
                      onClick={handleFindMovies} 
                      disabled={isLoading || (!!gteYear && !!lteYear && gteYear > lteYear)} 
                    />
                    {isLoading && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-indigo-400 animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    )}
                </div>
            </motion.div>

            <div className="lg:col-span-8 flex-1">
              <AnimatePresence mode="wait">
                {movies.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/10 rounded-3xl"
                  >
                    <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">🧞‍♂️</div>
                    <p className="text-muted-foreground max-w-xs">
                      No movies found yet. Select your criteria and click &quot;Find Movies&quot;!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
