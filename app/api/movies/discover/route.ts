import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies } from '@/lib/tmdb';

export async function POST(req: NextRequest) {
  try {
    const { genres, minRating, count } = await req.json();

    if (!genres || !Array.isArray(genres)) {
      return NextResponse.json({ error: 'Missing or invalid genres' }, { status: 400 });
    }

    const movies = await discoverMovies({
      genres,
      minRating: minRating || 0,
      count: count || 1,
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error discovering movies:', error);
    return NextResponse.json({ error: 'Failed to discover movies' }, { status: 500 });
  }
}
