-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "tmdb_id" TEXT NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "imdbRating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdb_id_key" ON "Movie"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdb_id_key" ON "Movie"("imdb_id");

-- CreateIndex
CREATE INDEX "Movie_tmdb_id_idx" ON "Movie"("tmdb_id");
