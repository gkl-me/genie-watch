import { fetchGenres, fetchLanguages } from '@/lib/tmdb';
import { Logo } from '@/components/ui/Logo';
import { HomeClient } from '@/components/home/HomeClient';
import { getErrorMessage } from '@/lib/axios-error';

export const dynamic = 'force-dynamic'; // Ensure fresh data if needed, or stick to default caching

export default async function Home() {

  let genres = [];
  let languages = [];
  try {
    [genres, languages] = await Promise.all([
      fetchGenres(),
      fetchLanguages()
    ]);
  } catch (error) {
    console.log(error)
    throw new Error(getErrorMessage(error))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground selection:bg-purple-500/30">
        
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        {/* Add more header items if needed */}
      </header>

      <main>
        <HomeClient initialGenres={genres} initialLanguages={languages} />
      </main>
      
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Genie Watch. All rights reserved.
      </footer>
    </div>
  );
}
