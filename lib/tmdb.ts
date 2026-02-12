import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const fetchGenres = async () => {
  const response = await tmdb.get('/genre/movie/list?language=en-US');
  return response.data.genres;
};

export const discoverMovies = async ({ 
  genres, 
  minRating, 
  count = 1 
}: { 
  genres: number[], 
  minRating: number, 
  count?: number 
}) => {
  const response = await tmdb.get('/discover/movie', {
    params: {
      with_genres: genres.join(','),
      'vote_average.gte': minRating,
      'vote_count.gte': 100, // Ensure movies have some votes for quality
      sort_by: 'popularity.desc',
      page: 1,
    },
  });

  // TMDB returns 20 per page, we slice to the requested count
  return response.data.results.slice(0, count);
};
