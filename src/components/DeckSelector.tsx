import React from 'react';
import { DECK_METADATA, type CardItem } from '../data/cards';
import { DoodleIcon } from './DoodleIcons';
import { Check } from 'lucide-react';

interface DeckSelectorProps {
  selectedLevels: (1 | 2 | 3 | 4 | 'guess')[];
  onToggleLevel: (level: 1 | 2 | 3 | 4 | 'guess') => void;
  cards: CardItem[];
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  selectedLevels,
  onToggleLevel,
  cards,
}) => {
  const levels: (1 | 2 | 3 | 4 | 'guess')[] = [1, 2, 3, 4, 'guess'];

  const getDeckCardCount = (lvl: 1 | 2 | 3 | 4 | 'guess') => {
    return cards.filter((c) => c.level === lvl).length;
  };

  const totalSelectedCards = cards.filter((c) => selectedLevels.includes(c.level)).length;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#FFFDF9] doodle-border doodle-shadow p-5 sm:p-6 rounded-[24px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-stone-200">
        <div>
          <h3 className="font-['Patrick_Hand'] text-2xl font-bold text-[#2B2523]">
            Pilih Level & Kategori Deck
          </h3>
          <p className="text-xs text-stone-500">
            Pilih tingkatan obrolan yang siap kalian jelajahi berdua.
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-[#FAF0D7] text-[#5A4518] doodle-border-sm text-xs font-bold font-['Patrick_Hand']">
            {totalSelectedCards} Kartu Terpilih
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {levels.map((lvl) => {
          const meta = DECK_METADATA[lvl.toString()];
          const isSelected = selectedLevels.includes(lvl);
          const count = getDeckCardCount(lvl);

          return (
            <div
              key={lvl.toString()}
              onClick={() => onToggleLevel(lvl)}
              className={`p-3.5 rounded-2xl doodle-border-sm cursor-pointer transition-all flex items-start gap-3 select-none ${
                isSelected
                  ? 'bg-[#FAF7F2] doodle-shadow-sm border-[#2B2523]'
                  : 'bg-white opacity-60 hover:opacity-90 border-stone-300'
              }`}
            >
              {/* Doodle Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg doodle-border-sm flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'bg-rose-500 text-white' : 'bg-stone-100 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>

              {/* Deck Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 font-['Patrick_Hand'] tracking-wide">
                      {meta.title}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full doodle-border-sm bg-stone-100 text-stone-600 font-medium">
                      {count} kartu
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                  {meta.description}
                </p>
              </div>

              {/* Decorative mini icon */}
              <div
                className="w-7 h-7 rounded-full doodle-border-sm flex items-center justify-center shrink-0"
                style={{ backgroundColor: meta.accentBg }}
              >
                <DoodleIcon
                  name={lvl === 1 ? 'sparkle' : lvl === 2 ? 'heart' : lvl === 3 ? 'moon' : lvl === 4 ? 'coffee' : 'gift'}
                  className="w-3.5 h-3.5 text-stone-800"
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedLevels.length === 0 && (
        <p className="text-xs text-rose-500 font-medium mt-3 text-center">
          ⚠️ Pilih minimal 1 deck untuk mulai bermain.
        </p>
      )}
    </div>
  );
};
