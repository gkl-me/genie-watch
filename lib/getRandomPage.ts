


export function getRandomPage(totalPages:number) {   

    const MAX_PAGES = 50;

    const usablePages = Math.min(totalPages, MAX_PAGES);

    return Math.floor(Math.random() * usablePages) + 1;
}