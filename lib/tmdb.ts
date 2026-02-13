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
  count = 1,
  gteYear,
  lteYear,
  page = 1
}: { 
  genres: number[], 
  minRating: number, 
  count?: number,
  gteYear?: number | null,
  lteYear?: number | null,
  page?: number
}) => {
  const params: any = {
    with_genres: genres.join(','),
    'vote_average.gte': minRating-1.5,
    'vote_count.gte': 100, // Ensure movies have some votes for quality
    sort_by: 'popularity.desc',
    page,
  };

  if (gteYear) {
    params['primary_release_date.gte'] = `${gteYear}-01-01`;
  }
  if (lteYear) {
    params['primary_release_date.lte'] = `${lteYear}-12-31`;
  }

  const response = await tmdb.get('/discover/movie', { params });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages
  };
};

export const getImdbId = async (tmdbId: number) => {
    const response = await tmdb.get(`/movie/${tmdbId}/external_ids`);
    return response.data.imdb_id;
};
