import { NextRequest, NextResponse } from 'next/server';
import { discoverMoviesWithFullLogic } from '@/lib/movieService';

export async function POST(req: NextRequest) {
  try {
    const { genres, minRating, count, gteYear, lteYear, excludeIds, language } = await req.json();

    if (!genres || !Array.isArray(genres)) {
      return NextResponse.json({ error: 'Missing or invalid genres' }, { status: 400 });
    }

    const movies = await discoverMoviesWithFullLogic({
      genres,
      minRating: minRating || 0,
      count: count || 1,
      gteYear,
      lteYear,
      excludeIds: excludeIds || [],
      language
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error discovering movies:', error);
    return NextResponse.json({ error: 'Failed to discover movies' }, { status: 500 });
  }
}
