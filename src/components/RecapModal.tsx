import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { CardItem } from '../data/cards';
import { Star, RotateCcw, Heart, Clock, Award, Home } from 'lucide-react';
import { DoodleIcon } from './DoodleIcons';

interface RecapModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onGoToMenu: () => void;
  cardsExplored: number;
  favoritedCards: CardItem[];
  player1Name: string;
  player2Name: string;
  sessionDurationMinutes: number;
}

export const RecapModal: React.FC<RecapModalProps> = ({
  isOpen,
  onRestart,
  onGoToMenu,
  cardsExplored,
  favoritedCards,
  player1Name,
  player2Name,
  sessionDurationMinutes,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Launch cute celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9EAA', '#FFE882', '#97CBA9', '#D5B4F0'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-[#FFFDF9] doodle-border doodle-shadow-lg p-6 sm:p-8 rounded-[32px] text-center">
        {/* Washi Tape */}
        <div className="washi-tape washi-tape-pink" />

        {/* Celebration Header */}
        <div className="w-16 h-16 rounded-full bg-[#FFE882] doodle-border flex items-center justify-center mx-auto mb-3 doodle-shadow-sm">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
        </div>

        <h2 className="font-['Patrick_Hand'] text-3xl sm:text-4xl font-bold text-[#2B2523]">
          Sesi Deeptalk Selesai!
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Terima kasih sudah meluangkan waktu dan membuka hati untuk satu sama lain hari ini,{' '}
          <strong className="text-stone-900">{player1Name}</strong> &{' '}
          <strong className="text-stone-900">{player2Name}</strong>. ❤️
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 text-left">
          <div className="p-3.5 bg-[#FAF7F2] doodle-border-sm rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-['Patrick_Hand'] text-stone-900">
                {cardsExplored} Kartu
              </div>
              <div className="text-[11px] text-stone-500">Telah Kalian Bicarakan</div>
            </div>
          </div>

          <div className="p-3.5 bg-[#FAF7F2] doodle-border-sm rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-['Patrick_Hand'] text-stone-900">
                {sessionDurationMinutes > 0 ? `${sessionDurationMinutes} Menit` : '< 1 Menit'}
              </div>
              <div className="text-[11px] text-stone-500">Waktu Berkualitas</div>
            </div>
          </div>
        </div>

        {/* Favorited Cards Section */}
        {favoritedCards.length > 0 ? (
          <div className="text-left mb-6">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-['Patrick_Hand']">
                Kartu Favorit yang Ditandai ({favoritedCards.length})
              </h4>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {favoritedCards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="p-3 bg-[#FAF7F2] doodle-border-sm rounded-xl text-xs text-stone-800 flex items-start gap-2.5"
                >
                  <div className="mt-0.5">
                    <DoodleIcon name={card.doodleIcon} className="w-4 h-4 text-stone-700" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block font-['Patrick_Hand']">
                      {card.categoryTitle}
                    </span>
                    <p className="font-medium text-stone-900">"{card.question}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic mb-5">
            (Belum ada kartu yang ditandai bintang di sesi ini)
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onGoToMenu}
            className="w-full sm:w-auto px-5 py-3 bg-white text-stone-800 doodle-border doodle-shadow-sm doodle-btn font-['Patrick_Hand'] text-lg font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5 text-stone-600" />
            <span>Kembali ke Menu Utama</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 bg-[#FFE882] text-stone-900 doodle-border doodle-shadow-sm doodle-btn font-['Patrick_Hand'] text-lg font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5 text-stone-800" />
            <span>Main Lagi Bersama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
