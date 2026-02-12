'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getErrorMessage } from '@/lib/axios-error';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const message = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full glass p-8 rounded-3xl text-center space-y-6 border border-white/10"
      >
        <div className="relative w-24 h-24 mx-auto">
             <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-6xl"
             >
                🧞‍♂️
             </motion.div>
             <motion.div
                className="absolute top-0 right-0 text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
             >
                ⚠️
             </motion.div>
        </div>

        <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                Oops! The Genie Stumbled
            </h2>
            <p className="mt-2 text-muted-foreground">
                {message}
            </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            reset()
            router.refresh()
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:brightness-110 transition-all shadow-lg"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
