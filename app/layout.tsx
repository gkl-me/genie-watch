import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Import Outfit font
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Genie Watch - Discover Your Next Favorite Movie | Free Movie Finder",
  description: "Find your perfect movie instantly with Genie Watch. Discover trending movies, hidden gems, and personalized recommendations. Your magical movie discovery companion for Netflix, streaming, and cinema.",
  keywords: [
    "movie finder",
    "movie discovery",
    "random movie generator",
    "movie recommendations",
    "what to watch",
    "netflix movies",
    "streaming movies",
    "fmovies alternative",
    "free movie finder",
    "trending movies",
    "popular movies",
    "movie search",
    "film discovery",
    "cinema finder",
    "movie genres",
    "best movies",
    "movie ratings",
    "imdb alternative",
    "tmdb movies",
    "watch movies online",
  ],
  authors: [{ name: "Genie Watch" }],
  creator: "Genie Watch",
  publisher: "Genie Watch",
  robots: "index, follow",
  openGraph: {
    title: "Genie Watch - Discover Your Next Favorite Movie",
    description: "Find trending movies, hidden gems, and personalized recommendations instantly. Your magical movie discovery companion.",
    type: "website",
    locale: "en_US",
    siteName: "Genie Watch",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genie Watch - Discover Your Next Favorite Movie",
    description: "Find trending movies, hidden gems, and personalized recommendations instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
