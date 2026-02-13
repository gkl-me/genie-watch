

const SHOWN_KEY = "shown_movies"



function saveShownMovies(tmdbId:string) {

    const shownMovies = JSON.parse(localStorage.getItem(SHOWN_KEY) || "[]")

    shownMovies.push({tmdbId,time:Date.now()})

    localStorage.setItem(SHOWN_KEY, JSON.stringify(shownMovies))

}


function getShownMovies() {

    let shownMovies: {tmdbId:string,time:number}[] = JSON.parse(localStorage.getItem(SHOWN_KEY) || "[]")

    //1 hour in ms
    const time = 60 * 60 * 1000;
    
    shownMovies = shownMovies.filter((m) => Date.now() - m.time < time)

    localStorage.setItem(SHOWN_KEY, JSON.stringify(shownMovies))

    return shownMovies
}
