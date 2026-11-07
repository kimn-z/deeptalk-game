import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/audio';

interface FloatingItem {
  id: string;
  emoji: string;
  sender: string;
  x: number;
}

interface DoodleReactionsProps {
  onSendReaction: (emoji: string) => void;
  incomingReaction?: { emoji: string; sender: string; timestamp: number } | null;
}

const REACTION_EMOJIS = [
  { emoji: '❤️', label: 'Cinta' },
  { emoji: '🥺', label: 'Haru' },
  { emoji: '✨', label: 'Binar' },
  { emoji: '☕', label: 'Hangat' },
  { emoji: '🫂', label: 'Peluk' },
  { emoji: '🎯', label: 'Tepat' },
];

export const DoodleReactions: React.FC<DoodleReactionsProps> = ({
  onSendReaction,
  incomingReaction,
}) => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  // Trigger floating reaction whenever an incoming reaction arrives
  useEffect(() => {
    if (incomingReaction) {
      triggerReaction(incomingReaction.emoji, incomingReaction.sender);
    }
  }, [incomingReaction]);

  const triggerReaction = (emoji: string, sender: string) => {
    sounds.playPop();
    const newItem: FloatingItem = {
      id: Math.random().toString(),
      emoji,
      sender,
      x: 10 + Math.random() * 80, // percentage across screen width
    };
    setItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.id !== newItem.id));
    }, 2400);
  };

  const handleTap = (emoji: string) => {
    onSendReaction(emoji);
    triggerReaction(emoji, 'Kamu');
  };

  return (
    <>
      {/* Floating animations container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: window.innerHeight - 80, scale: 0.5, x: `${item.x}vw` }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: window.innerHeight * 0.2,
                scale: [0.5, 1.4, 1.2, 0.8],
                rotate: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="absolute flex flex-col items-center"
            >
              <span className="text-4xl drop-shadow-md select-none">{item.emoji}</span>
              <span className="text-[10px] bg-white/90 text-stone-700 px-1.5 py-0.5 rounded-full doodle-border-sm mt-1 font-['Patrick_Hand'] shadow-sm">
                {item.sender}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Emoji reaction bar at bottom or side */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-[#FFFDF9]/90 backdrop-blur-sm doodle-border-sm rounded-full doodle-shadow-sm max-w-fit mx-auto">
        <span className="text-xs font-['Patrick_Hand'] text-stone-400 mr-1 hidden sm:inline select-none">
          Kirim Reaksi:
        </span>
        {REACTION_EMOJIS.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => handleTap(emoji)}
            title={label}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-stone-100 hover:scale-125 active:scale-95 transition-all text-base sm:text-lg select-none"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};
