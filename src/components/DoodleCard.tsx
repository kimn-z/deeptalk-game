import React from 'react';
import { motion } from 'framer-motion';
import { type CardItem, DECK_METADATA } from '../data/cards';
import { DoodleIcon } from './DoodleIcons';
import { Star, Sparkles } from 'lucide-react';

interface DoodleCardProps {
  card: CardItem;
  isFlipped: boolean;
  onFlip: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  activePlayerName: string;
  isMyTurn: boolean;
  isOnlineMode: boolean;
  cardNumber: number;
  totalCards: number;
}

export const DoodleCard: React.FC<DoodleCardProps> = ({
  card,
  isFlipped,
  onFlip,
  isFavorite,
  onToggleFavorite,
  activePlayerName,
  isMyTurn,
  isOnlineMode,
  cardNumber,
  totalCards,
}) => {
  const meta = DECK_METADATA[card.level.toString()];

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto h-[270px] sm:h-[310px] perspective-1000 select-none cursor-pointer">
      {/* Washi Tape Accent */}
      <div className={`washi-tape ${card.level === 3 ? 'washi-tape-pink' : card.level === 4 ? 'washi-tape-blue' : ''}`} />

      {/* Floating Favorite Star Button */}
      <button
        onClick={onToggleFavorite}
        title={isFavorite ? 'Hapus dari favorit' : 'Tandai kartu favorit'}
        className={`absolute -top-2.5 -right-2 z-30 p-2 rounded-full doodle-border-sm bg-white doodle-shadow-sm transition-transform hover:scale-110 active:scale-90 ${
          isFavorite ? 'text-[#FFB200] fill-[#FFB200]' : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#FFB200]' : ''}`} />
      </button>

      {/* Flip Motion Container */}
      <motion.div
        className="w-full h-full preserve-3d relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20, stiffness: 90 }}
        onClick={onFlip}
      >
        {/* ================= CARD FRONT (Cover/Tutup) ================= */}
        <div className="absolute inset-0 backface-hidden doodle-border bg-[#FFFDF9] doodle-shadow-lg rounded-[24px] p-4 sm:p-5 flex flex-col justify-between items-center text-center overflow-hidden border-[#2B2523]">
          {/* Decorative Corner Doodles */}
          <div className="absolute top-3 left-3 text-stone-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-3 right-3 text-stone-300">
            <DoodleIcon name="heart" className="w-4 h-4 text-stone-300" />
          </div>
          <div className="absolute bottom-3 left-3 text-stone-300">
            <DoodleIcon name="star" className="w-4 h-4 text-stone-300" />
          </div>
          <div className="absolute bottom-3 right-3 text-stone-300">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Top Badge */}
          <div className="mt-1">
            <span className="inline-block px-3 py-0.5 text-[11px] font-semibold tracking-wider uppercase doodle-border-sm bg-[#FAF0D7] text-[#5A4518]">
              {meta ? meta.badge : 'Kartu Cinta'}
            </span>
            <div className="text-[10px] text-stone-400 mt-0.5 font-medium">
              Kartu #{cardNumber} dari {totalCards}
            </div>
          </div>

          {/* Center Illustration & Title */}
          <div className="my-auto flex flex-col items-center">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full doodle-border flex items-center justify-center doodle-shadow-sm mb-2 transition-transform hover:scale-105"
              style={{ backgroundColor: meta ? meta.accentBg : '#FFE882' }}
            >
              <DoodleIcon name={card.doodleIcon} className="w-7 h-7 sm:w-8 sm:h-8 text-[#2B2523]" />
            </div>

            <h3 className="font-['Patrick_Hand'] text-2xl sm:text-3xl font-bold text-[#2B2523] tracking-wide leading-tight">
              {meta ? meta.title.split(':')[1] || meta.title : 'Deeptalk Card'}
            </h3>
            <p className="text-[11px] text-stone-500 max-w-[220px] mt-0.5 italic line-clamp-1">
              {meta ? meta.subtitle : 'Buka & bicarakan dengan jujur'}
            </p>
          </div>

          {/* Bottom Flip Hint & Player Indicator */}
          <div className="w-full">
            <div className="doodle-border-sm bg-[#FAF7F2] py-1.5 px-2 mb-1 rounded-xl text-[11px] flex items-center justify-center gap-1.5 font-medium text-stone-700">
              <span className="text-sm">✨</span>
              <span>
                Giliran:{' '}
                <strong className="text-rose-700">
                  {activePlayerName}
                  {isOnlineMode && isMyTurn ? ' (Kamu)' : ''}
                </strong>
              </span>
            </div>

            <div className="text-[10px] font-['Patrick_Hand'] text-stone-400 text-center tracking-wider animate-pulse flex items-center justify-center gap-1">
              <span>(Sentuh kartu untuk membuka)</span>
              <span className="text-stone-600">👉</span>
            </div>
          </div>
        </div>

        {/* ================= CARD BACK (Isi Pertanyaan) ================= */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 doodle-border bg-[#FFFDF9] doodle-shadow-lg rounded-[24px] p-4 sm:p-5 flex flex-col justify-between text-left overflow-hidden border-[#2B2523]">
          {/* Top Category Header */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-stone-200">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full doodle-border-sm flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.accentColor || '#FFE882' }}
              >
                <DoodleIcon name={card.doodleIcon} className="w-3.5 h-3.5 text-[#2B2523]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-700 font-['Patrick_Hand'] tracking-wide uppercase block leading-none">
                  {card.categoryTitle}
                </span>
                <span className="text-[9px] text-stone-400 font-medium leading-none">
                  {meta?.badge || 'Level Pertanyaan'}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold font-['Caveat'] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
              #{cardNumber} / {totalCards}
            </span>
          </div>

          {/* Question Text Area */}
          <div className="my-auto py-1.5">
            <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base font-bold leading-snug text-[#2B2523]">
              "{card.question}"
            </p>

            {/* Instruction / Sweet Cue */}
            {card.instruction && (
              <div className="mt-2.5 p-2 bg-[#FAF7F2] doodle-border-sm rounded-xl text-[11px] text-stone-700 flex items-start gap-1.5 shadow-[1px_1px_0px_#E8DFD3]">
                <span className="text-sm select-none shrink-0">💡</span>
                <div className="flex-1 leading-tight">
                  <span className="font-bold font-['Patrick_Hand'] text-stone-900 mr-1">
                    Catatan:
                  </span>
                  <span className="italic text-stone-600">{card.instruction}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Turn Banner */}
          <div className="pt-2 border-t-2 border-dashed border-stone-200">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-medium">
                  {activePlayerName} menjawab
                </span>
              </div>
              <span className="text-stone-400 text-[10px] font-['Patrick_Hand']">
                (Sentuh untuk tutup)
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
