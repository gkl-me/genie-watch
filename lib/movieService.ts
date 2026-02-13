import { discoverMovies, getImdbId } from './tmdb';
import { getRandomPage } from './getRandomPage';
import { shuffleMovies } from './shuffleMovies';
import { fetchImdbRating } from './omdb';
import prisma from './prisma';

interface DiscoverParams {
  genres: number[];
  minRating: number;
  count: number;
  gteYear?: number | null;
  lteYear?: number | null;
  excludeIds?: number[];
  language?: string;
}

export async function discoverMoviesWithFullLogic({
  genres,
  minRating,
  count,
  gteYear,
  lteYear,
  excludeIds = [],
  language
}: DiscoverParams) {
  let attempts = 0;
  const maxAttempts = 5; // Reasonable limit to avoid excessive API calls
  let validMovies: any[] = [];
  const processedTmdbIds = new Set<number>();

  // 1. Initial request to get total pages
  const initial = await discoverMovies({ genres, minRating, count, gteYear, lteYear, page: 1, language });
  const totalPages = initial.total_pages;

  while (attempts < maxAttempts && validMovies.length < count) {
    const randomPage = getRandomPage(totalPages);
    const { results } = await discoverMovies({ 
        genres, 
        minRating, 
        count, 
        gteYear, 
        lteYear, 
        page: randomPage,
        language
    });

    // 2. Filter and Enhance this batch
    const batchResults = await Promise.all(
      results.map(async (movie: any) => {
        // Skip if already seen in this session or in the exclude list
        if (processedTmdbIds.has(movie.id) || excludeIds.includes(movie.id)) {
          return null;
        }
        processedTmdbIds.add(movie.id);

        try {
          // Check Prisma Cache first
          let dbMovie = await prisma.movie.findUnique({
            where: { tmdb_id: movie.id.toString() }
          });

          let imdbRating: number | null = null;
          let imdbId: string | null = null;

          if (dbMovie) {
            imdbRating = dbMovie.imdbRating;
          } else {
            // Not in DB, get IMDb ID from TMDB
            imdbId = await getImdbId(movie.id);
            if (imdbId) {
              // Get rating from OMDB
              imdbRating = await fetchImdbRating(imdbId);
              
              if (imdbRating !== null) {
                // Save to Prisma for future use
                await prisma.movie.upsert({
                  where: { tmdb_id: movie.id.toString() },
                  update: { imdbRating, imdb_id: imdbId },
                  create: {
                    tmdb_id: movie.id.toString(),
                    imdb_id: imdbId,
                    imdbRating
                  }
                });
              }
            }
          }

          // Use IMDb rating if available, otherwise fallback to TMDB rating
          // Filter: Rating must be >= user's minRating
          const finalRating = imdbRating !== null ? imdbRating : movie.vote_average;
          
          if (finalRating >= minRating) {
            return { ...movie, imdbRating: finalRating };
          }
          return null;
        } catch (error) {
          console.error(`Error enhancing movie ${movie.id}:`, error);
          // Fallback to TMDB rating if enhancement fails
          if (movie.vote_average >= minRating) {
            return { ...movie, imdbRating: movie.vote_average };
          }
          return null;
        }
      })
    );

    // Add valid movies from this batch to the collection
    const validBatch = batchResults.filter((m): m is any => m !== null);
    validMovies = [...validMovies, ...validBatch];
    
    attempts++;
  }

  // Shuffle and pick requested count
  return shuffleMovies(validMovies).slice(0, count);
}
