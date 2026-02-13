import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export async function fetchImdbRating(imdbId: string) {
    if (!OMDB_API_KEY) return null;
    try {
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                i: imdbId,
                apikey: OMDB_API_KEY
            }
        });
        
        if (response.data.Response === 'True') {
            const rating = parseFloat(response.data.imdbRating);
            return isNaN(rating) ? null : rating;
        }
        return null;
    } catch (error) {
        console.error('Error fetching from OMDB:', error);
        return null;
    }
}
