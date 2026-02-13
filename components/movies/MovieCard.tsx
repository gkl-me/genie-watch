'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Info, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  imdbRating: number;
  release_date: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPlayOptions, setShowPlayOptions] = useState(false);

  const streamingSites = [
    { name: 'Cineby', url: `${process.env.NEXT_PUBLIC_CINEBY}${movie.id}` },
    { name: 'FlickyStream', url: `${process.env.NEXT_PUBLIC_FLICKY}${movie.id}` },
    { name: 'Rive', url: `${process.env.NEXT_PUBLIC_RIVE}${movie.id}` },
  ];

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl border border-white/5 h-[450px] w-full max-w-[300px] cursor-pointer"
    >
      {/* Poster Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/60 transition-colors duration-300" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end space-y-3">
        <div className="space-y-1">
          <motion.h3 
            className="text-xl font-bold text-white line-clamp-2 leading-tight"
            animate={{ y: isHovered ? -10 : 0 }}
          >
            {movie.title}
          </motion.h3>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-white">{ movie.imdbRating || movie.vote_average.toFixed(1) }</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{movie.release_date?.split('-')[0]}</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 pt-2"
            >
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlayOptions(!showPlayOptions);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg active:scale-95 duration-200"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play Now
                </button>
                <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">
                  <Info className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Streaming Options Modal Overlay */}
      <AnimatePresence>
        {showPlayOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4"
            onClick={(e) => {
              e.stopPropagation();
              setShowPlayOptions(false);
            }}
          >
            <h4 className="text-white font-bold text-lg mb-2">Choose Stream</h4>
            <div className="w-full space-y-3">
              {streamingSites.map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-gray-200 font-medium">{site.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
                </a>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPlayOptions(false);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
