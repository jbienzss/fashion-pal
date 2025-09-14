import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// #region [Private Constants]
const FUNNY_QUOTES = [
  "In a parallel universe, you're already wearing the perfect outfit for this event!",
  "Quantum mechanics suggests you're wearing all outfits until someone observes it.",
  "In another dimension, formal wear is just pajamas with extra steps.",
  "The butterfly effect: a single accessory choice could change your entire evening.",
  "Quantum entanglement: when your shoes mysteriously coordinate with your shirt.",
  "Parallel you is probably wearing the same outfit right now. Awkward.",
  "The many-worlds interpretation: every fashion choice creates a new timeline.",
  "Dark matter: the color of all your t-shirts.",
  "The anthropic principle: the universe exists because you need somewhere to wear your outfits.",
  "I'm never overdressed or underdressed - I exist in a quantum superposition of both.",
  "In a parallel universe, your outfit chooses you.",
  "Uncertainty principle: the more you try to dress appropriately, the less certain you are.",
  "My shopping cart has more items than my closet.",
  "Online shopping: where you buy things you didn't know you needed until 2 AM.",
  "The algorithm knows my style better than I do, and I'm not mad about it.",
  "I have a PhD in 'Add to Cart' but haven't figured out 'Remove from Cart'.",
  "I'm not addicted to shopping, I'm just optimizing my wardrobe algorithm."
];
// #endregion [Private Constants]

interface LoadingScreenProps {
  title: string;
  description: string;
}

/**
 * LoadingScreen Component
 * 
 * A reusable loading screen component that displays a spinner with
 * customizable title and description text, plus rotating funny quotes.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ title, description }) => {
  // #region [Private Variables]
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(Math.floor(Math.random() * FUNNY_QUOTES.length));
  const [usedQuotes, setUsedQuotes] = useState<Set<number>>(new Set([Math.floor(Math.random() * FUNNY_QUOTES.length)]));
  // #endregion [Private Variables]

  // #region [Private Methods]
  /**
   * Gets the next quote index, ensuring no quote is repeated until all have been shown
   */
  const getNextQuoteIndex = (): number => {
    // If all quotes have been used, reset the set
    if (usedQuotes.size >= FUNNY_QUOTES.length) {
      setUsedQuotes(new Set());
    }

    // Get available quotes (not yet used)
    const availableQuotes = Array.from({ length: FUNNY_QUOTES.length }, (_, i) => i)
      .filter(index => !usedQuotes.has(index));

    // If no available quotes (shouldn't happen), return random
    if (availableQuotes.length === 0) {
      return Math.floor(Math.random() * FUNNY_QUOTES.length);
    }

    // Return a random quote from available ones
    return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  };
  // #endregion [Private Methods]

  // #region [Public Methods]
  /**
   * Effect hook to rotate quotes every 8 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = getNextQuoteIndex();
      setCurrentQuoteIndex(nextIndex);
      setUsedQuotes(prev => new Set([...prev, nextIndex]));
    }, 8000);

    return () => clearInterval(interval);
  }, []);
  // #endregion [Public Methods]

  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg shadow-sm border border-dark-600">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            {/* Spinning loader */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-dark-100 mb-2">{title}</h3>
            
            {/* Description */}
            <p className="text-sm text-dark-300 mb-6">{description}</p>
            
            {/* Rotating funny quotes */}
            <div className="min-h-[3rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-lg text-dark-400 italic max-w-md px-4"
                >
                  "{FUNNY_QUOTES[currentQuoteIndex]}"
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
