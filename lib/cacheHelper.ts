const SHOWN_KEY = "shown_movies";

export function saveShownMovies(tmdbId: number) {
    if (typeof window === 'undefined') return;
    const shownMovies = getShownMovies();
    shownMovies.push({ tmdbId, time: Date.now() });
    localStorage.setItem(SHOWN_KEY, JSON.stringify(shownMovies));
}

export function getShownMovies() {
    if (typeof window === 'undefined') return [];
    let shownMovies: { tmdbId: number, time: number }[] = JSON.parse(localStorage.getItem(SHOWN_KEY) || "[]");

    // 30 minutes in ms
    const thirtyMinutes = 30 * 60 * 1000;
    
    shownMovies = shownMovies.filter((m) => Date.now() - m.time < thirtyMinutes);

    localStorage.setItem(SHOWN_KEY, JSON.stringify(shownMovies));

    return shownMovies;
}
