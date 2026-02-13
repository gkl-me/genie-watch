'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Globe, Check, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (iso: string) => void;
}

export function LanguageSelector({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLang = useMemo(() => 
    languages.find(l => l.iso_639_1 === selectedLanguage) || null
  , [languages, selectedLanguage]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return languages.slice(0, 50); // Show top 50 by default to avoid lag
    return languages
      .filter(l => 
        l.english_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 50);
  }, [languages, searchQuery]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4" ref={containerRef}>
      <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Original Language
      </h2>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full px-4 py-3 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between group",
            isOpen 
              ? "bg-white/10 border-white/20 shadow-lg shadow-purple-500/10" 
              : "bg-white/5 border-white/10 hover:border-white/20"
          )}
        >
          <div className="flex items-center gap-3">
            <span className={clsx(
              "text-sm font-medium",
              selectedLang ? "text-white" : "text-muted-foreground"
            )}>
              {selectedLang ? selectedLang.english_name : "Any Language"}
            </span>
          </div>
          <ChevronDown className={clsx(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-black/50"
            >
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-white" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => {
                    onLanguageChange('');
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center justify-between",
                    selectedLanguage === '' ? "text-purple-400 bg-purple-500/5 font-semibold" : "text-muted-foreground"
                  )}
                >
                  Any Language
                  {selectedLanguage === '' && <Check className="w-4 h-4" />}
                </button>
                
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.iso_639_1}
                    onClick={() => {
                      onLanguageChange(lang.iso_639_1);
                      setIsOpen(false);
                    }}
                    className={clsx(
                      "w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center justify-between",
                      selectedLanguage === lang.iso_639_1 ? "text-purple-400 bg-purple-500/5 font-semibold" : "text-white/80"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.english_name}</span>
                    </div>
                    {selectedLanguage === lang.iso_639_1 && <Check className="w-4 h-4" />}
                  </button>
                ))}
                
                {filteredLanguages.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                   🧞‍♂️ Genie couldn&apos;t find that language.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
