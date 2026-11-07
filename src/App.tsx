import React, { useState, useEffect, useMemo, useRef } from 'react';
import { COUPLE_CARDS, type CardItem } from './data/cards';
import { DoodleCard } from './components/DoodleCard';
import { DoodleReactions } from './components/DoodleReactions';
import { LobbyView } from './components/LobbyView';
import { RecapModal } from './components/RecapModal';
import { peerService, type NetworkMessage, type GameSyncState } from './services/peerService';
import { sounds } from './utils/audio';
import { 
  ArrowLeft, 
  ArrowRight, 
  Repeat, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Flag
} from 'lucide-react';

export const App: React.FC = () => {
  // Game mode: 'lobby' | 'playing'
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [playMode, setPlayMode] = useState<'online' | 'local'>('local');

  // Selected Decks
  const [selectedLevels, setSelectedLevels] = useState<(1 | 2 | 3 | 4 | 'guess')[]>([1, 2, 3, 4, 'guess']);

  // Player Info
  const [hostPlayerName, setHostPlayerName] = useState('Pemain 1');
  const [guestPlayerName, setGuestPlayerName] = useState('Pemain 2');
  const [isHost, setIsHost] = useState(true);

  // Online Connection State
  const [onlineStatus, setOnlineStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
  const [onlineError, setOnlineError] = useState<string | undefined>();
  const [isHostWaiting, setIsHostWaiting] = useState(false);
  const [activeRoomCode, setActiveRoomCode] = useState('');

  // Active Game State
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTurn, setActiveTurn] = useState<'host' | 'guest'>('host');
  const [favoritedCardIds, setFavoritedCardIds] = useState<string[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Floating reactions
  const [incomingReaction, setIncomingReaction] = useState<{ emoji: string; sender: string; timestamp: number } | null>(null);

  // Keep a ref to latest state for P2P sync handlers
  const stateRef = useRef({
    cardOrder,
    currentIndex,
    isFlipped,
    activeTurn,
    hostPlayerName,
    guestPlayerName,
    favoritedCardIds,
    skippedCount,
    sessionStartTime,
  });

  useEffect(() => {
    stateRef.current = {
      cardOrder,
      currentIndex,
      isFlipped,
      activeTurn,
      hostPlayerName,
      guestPlayerName,
      favoritedCardIds,
      skippedCount,
      sessionStartTime,
    };
  }, [cardOrder, currentIndex, isFlipped, activeTurn, hostPlayerName, guestPlayerName, favoritedCardIds, skippedCount, sessionStartTime]);

  // Card Lookup Map
  const cardsById = useMemo(() => {
    const map = new Map<string, CardItem>();
    COUPLE_CARDS.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  // Filtered Cards available based on selected levels
  const availableCards = useMemo(() => {
    return COUPLE_CARDS.filter((c) => selectedLevels.includes(c.level));
  }, [selectedLevels]);

  // Active Card Item
  const activeCard = useMemo(() => {
    if (cardOrder.length === 0 || currentIndex >= cardOrder.length) {
      return availableCards[0] || COUPLE_CARDS[0];
    }
    const id = cardOrder[currentIndex];
    return cardsById.get(id) || COUPLE_CARDS[0];
  }, [cardOrder, currentIndex, availableCards, cardsById]);

  // Shuffle helper
  const shuffleDeck = (cards: CardItem[]): string[] => {
    const ids = cards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  };

  // Toggle Level in Deck
  const handleToggleLevel = (lvl: 1 | 2 | 3 | 4 | 'guess') => {
    sounds.playTap();
    if (selectedLevels.includes(lvl)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels((prev) => prev.filter((l) => l !== lvl));
      }
    } else {
      setSelectedLevels((prev) => [...prev, lvl]);
    }
  };

  // Sound Toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

  // ================= PEERJS NETWORKING SETUP =================
  useEffect(() => {
    const unsubStatus = peerService.onStatusChange((status, err) => {
      setOnlineStatus(status);
      setOnlineError(err);
      if (status === 'connected') {
        setIsHostWaiting(false);
      }
    });

    const unsubMsg = peerService.onMessage((msg: NetworkMessage) => {
      handleIncomingNetworkMessage(msg);
    });

    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, []);

  const handleIncomingNetworkMessage = (msg: NetworkMessage) => {
    switch (msg.type) {
      case 'JOIN': {
        // Guest just joined the host
        sounds.playChime();
        setGuestPlayerName(msg.playerName);
        setIsHostWaiting(false);

        // Host generates initial game state and sends SYNC_STATE to guest
        const shuffled = shuffleDeck(availableCards);
        const initialState: GameSyncState = {
          cardOrder: shuffled,
          currentIndex: 0,
          isFlipped: false,
          activePlayer: 'host',
          hostName: stateRef.current.hostPlayerName,
          guestName: msg.playerName,
          favoritedIds: [],
          skippedCount: 0,
          startedAt: Date.now(),
          isFinished: false,
        };

        setCardOrder(initialState.cardOrder);
        setCurrentIndex(initialState.currentIndex);
        setIsFlipped(initialState.isFlipped);
        setActiveTurn(initialState.activePlayer);
        setSessionStartTime(initialState.startedAt);
        setGameState('playing');

        peerService.send({
          type: 'SYNC_STATE',
          state: initialState,
        });
        break;
      }

      case 'SYNC_STATE': {
        // Guest receives full state from Host
        sounds.playChime();
        setCardOrder(msg.state.cardOrder);
        setCurrentIndex(msg.state.currentIndex);
        setIsFlipped(msg.state.isFlipped);
        setActiveTurn(msg.state.activePlayer);
        setHostPlayerName(msg.state.hostName);
        setGuestPlayerName(msg.state.guestName);
        setFavoritedCardIds(msg.state.favoritedIds);
        setSkippedCount(msg.state.skippedCount);
        setSessionStartTime(msg.state.startedAt);
        setGameState('playing');
        break;
      }

      case 'FLIP_CARD': {
        sounds.playCardFlip();
        setIsFlipped(msg.isFlipped);
        break;
      }

      case 'NEXT_CARD': {
        sounds.playTap();
        setCurrentIndex(msg.nextIndex);
        setIsFlipped(false);
        setActiveTurn(msg.newTurn);
        break;
      }

      case 'PREV_CARD': {
        sounds.playTap();
        setCurrentIndex(msg.prevIndex);
        setIsFlipped(false);
        break;
      }

      case 'REVERSE_TURN': {
        sounds.playTap();
        setActiveTurn(msg.newTurn);
        break;
      }

      case 'SKIP_CARD': {
        sounds.playTap();
        setSkippedCount((prev) => prev + 1);
        setCurrentIndex(msg.nextIndex);
        setIsFlipped(false);
        break;
      }

      case 'TOGGLE_FAVORITE': {
        sounds.playChime();
        setFavoritedCardIds(msg.favoritedIds);
        break;
      }

      case 'REACTION': {
        setIncomingReaction({
          emoji: msg.emoji,
          sender: msg.sender,
          timestamp: Date.now(),
        });
        break;
      }

      case 'FINISH_SESSION': {
        sounds.playChime();
        setIsRecapOpen(true);
        break;
      }

      case 'RESTART_SESSION': {
        sounds.playChime();
        setCardOrder(msg.state.cardOrder);
        setCurrentIndex(0);
        setIsFlipped(false);
        setActiveTurn('host');
        setFavoritedCardIds([]);
        setSkippedCount(0);
        setSessionStartTime(Date.now());
        setIsRecapOpen(false);
        break;
      }
    }
  };

  // ================= START LOCAL PASS-AND-PLAY =================
  const handleStartPassAndPlay = (p1: string, p2: string) => {
    setPlayMode('local');
    setHostPlayerName(p1);
    setGuestPlayerName(p2);
    setIsHost(true);

    const shuffled = shuffleDeck(availableCards);
    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveTurn('host');
    setFavoritedCardIds([]);
    setSkippedCount(0);
    setSessionStartTime(Date.now());
    setGameState('playing');
  };

  // ================= HOST CREATE ROOM =================
  const handleCreateOnlineRoom = (hostName: string, roomCode: string) => {
    setPlayMode('online');
    setIsHost(true);
    setHostPlayerName(hostName);
    setActiveRoomCode(roomCode);
    setIsHostWaiting(true);

    peerService.createRoom(
      roomCode,
      hostName,
      (code) => {
        setActiveRoomCode(code);
      },
      (err) => {
        setIsHostWaiting(false);
        setOnlineError(err);
      }
    );
  };

  // ================= GUEST JOIN ROOM =================
  const handleJoinOnlineRoom = (guestName: string, roomCode: string) => {
    setPlayMode('online');
    setIsHost(false);
    setGuestPlayerName(guestName);
    setActiveRoomCode(roomCode);

    peerService.joinRoom(
      roomCode,
      guestName,
      () => {
        // joined successfully, waiting for Host's SYNC_STATE
      },
      (err) => {
        setOnlineError(err);
      }
    );
  };

  // ================= GAMEPLAY ACTIONS =================
  const handleFlipCard = () => {
    const nextFlip = !isFlipped;
    sounds.playCardFlip();
    setIsFlipped(nextFlip);

    if (playMode === 'online') {
      peerService.send({
        type: 'FLIP_CARD',
        isFlipped: nextFlip,
      });
    }
  };

  const handleNextCard = () => {
    if (currentIndex + 1 >= cardOrder.length) {
      handleFinishSession();
      return;
    }
    sounds.playTap();
    const nextIdx = currentIndex + 1;
    const nextTurn = activeTurn === 'host' ? 'guest' : 'host';

    setCurrentIndex(nextIdx);
    setIsFlipped(false);
    setActiveTurn(nextTurn);

    if (playMode === 'online') {
      peerService.send({
        type: 'NEXT_CARD',
        nextIndex: nextIdx,
        newTurn: nextTurn,
      });
    }
  };

  const handlePrevCard = () => {
    if (currentIndex === 0) return;
    sounds.playTap();
    const prevIdx = currentIndex - 1;

    setCurrentIndex(prevIdx);
    setIsFlipped(false);

    if (playMode === 'online') {
      peerService.send({
        type: 'PREV_CARD',
        prevIndex: prevIdx,
      });
    }
  };

  const handleReverseTurn = () => {
    sounds.playTap();
    const newTurn = activeTurn === 'host' ? 'guest' : 'host';
    setActiveTurn(newTurn);

    if (playMode === 'online') {
      peerService.send({
        type: 'REVERSE_TURN',
        newTurn,
      });
    }
  };

  const handleSkipCard = () => {
    sounds.playTap();
    setSkippedCount((prev) => prev + 1);

    if (currentIndex + 1 >= cardOrder.length) {
      handleFinishSession();
      return;
    }

    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setIsFlipped(false);

    if (playMode === 'online') {
      peerService.send({
        type: 'SKIP_CARD',
        nextIndex: nextIdx,
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playChime();
    const cardId = activeCard.id;
    let nextList: string[];
    if (favoritedCardIds.includes(cardId)) {
      nextList = favoritedCardIds.filter((id) => id !== cardId);
    } else {
      nextList = [...favoritedCardIds, cardId];
    }
    setFavoritedCardIds(nextList);

    if (playMode === 'online') {
      peerService.send({
        type: 'TOGGLE_FAVORITE',
        cardId,
        favoritedIds: nextList,
      });
    }
  };

  const handleSendReaction = (emoji: string) => {
    if (playMode === 'online') {
      const myName = isHost ? hostPlayerName : guestPlayerName;
      peerService.send({
        type: 'REACTION',
        emoji,
        sender: myName,
      });
    }
  };

  const handleFinishSession = () => {
    sounds.playChime();
    setIsRecapOpen(true);
    if (playMode === 'online') {
      peerService.send({ type: 'FINISH_SESSION' });
    }
  };

  const handleRestartSession = () => {
    const shuffled = shuffleDeck(availableCards);
    const newState: GameSyncState = {
      cardOrder: shuffled,
      currentIndex: 0,
      isFlipped: false,
      activePlayer: 'host',
      hostName: hostPlayerName,
      guestName: guestPlayerName,
      favoritedIds: [],
      skippedCount: 0,
      startedAt: Date.now(),
      isFinished: false,
    };

    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveTurn('host');
    setFavoritedCardIds([]);
    setSkippedCount(0);
    setSessionStartTime(Date.now());
    setIsRecapOpen(false);

    if (playMode === 'online') {
      peerService.send({
        type: 'RESTART_SESSION',
        state: newState,
      });
    }
  };

  const handleGoToMenu = () => {
    sounds.playTap();
    peerService.disconnect();
    setIsRecapOpen(false);
    setGameState('lobby');
  };

  // Favorited card items for recap
  const favoritedCardsList = useMemo(() => {
    return favoritedCardIds.map((id) => cardsById.get(id)).filter(Boolean) as CardItem[];
  }, [favoritedCardIds, cardsById]);

  // Session duration in minutes
  const sessionMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);

  // Turn calculation
  const currentActiveName = activeTurn === 'host' ? hostPlayerName : guestPlayerName;
  const isMyTurn = playMode === 'local' || (isHost ? activeTurn === 'host' : activeTurn === 'guest');

  return (
    <div
      className={`selection:bg-[#FFE882] ${
        gameState === 'playing'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between'
          : 'min-h-screen'
      }`}
    >
      {/* ================= LOBBY VIEW ================= */}
      {gameState === 'lobby' ? (
        <LobbyView
          cards={COUPLE_CARDS}
          selectedLevels={selectedLevels}
          onToggleLevel={handleToggleLevel}
          onStartPassAndPlay={handleStartPassAndPlay}
          onCreateOnlineRoom={handleCreateOnlineRoom}
          onJoinOnlineRoom={handleJoinOnlineRoom}
          onlineStatus={onlineStatus}
          onlineError={onlineError}
          isHostWaiting={isHostWaiting}
          activeRoomCode={activeRoomCode}
        />
      ) : (
        /* ================= GAMEPLAY TABLE (NO SCROLL VIEWPORT) ================= */
        <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-3 h-full max-h-[100dvh] flex flex-col justify-between overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between gap-2 pb-2 mb-1 border-b-2 border-dashed border-stone-300 shrink-0">
            {/* Status / Room indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playTap();
                  if (confirm('Yakin ingin kembali ke beranda? Sesi saat ini akan ditutup.')) {
                    peerService.disconnect();
                    setGameState('lobby');
                    setIsRecapOpen(false);
                  }
                }}
                className="py-1 px-2.5 rounded-xl doodle-border-sm bg-white doodle-shadow-sm text-stone-700 hover:text-stone-900 doodle-btn text-xs font-bold font-['Patrick_Hand'] flex items-center gap-1"
                title="Kembali ke Menu"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>

              {playMode === 'online' ? (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-white doodle-border-sm rounded-full text-[11px] font-['Patrick_Hand'] font-bold text-stone-700 doodle-shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Room: {activeRoomCode}</span>
                </div>
              ) : (
                <div className="px-2 py-0.5 bg-white doodle-border-sm rounded-full text-[11px] font-['Patrick_Hand'] font-bold text-stone-700 doodle-shadow-sm">
                  <span>📱 Satu Layar</span>
                </div>
              )}
            </div>

            {/* Right Controls: Sound & Finish */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-full doodle-border-sm bg-white doodle-shadow-sm text-stone-600 hover:text-stone-900 doodle-btn"
                title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              <button
                onClick={handleFinishSession}
                className="py-1 px-2.5 bg-[#FFE882] text-stone-900 doodle-border-sm doodle-shadow-sm doodle-btn rounded-xl font-['Patrick_Hand'] text-xs font-bold flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Akhiri Sesi</span>
              </button>
            </div>
          </header>

          {/* Turn Banner */}
          <div className="mb-1 text-center shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF9] doodle-border-sm rounded-full doodle-shadow-sm">
              <span className="text-xs">🗣️</span>
              <span className="font-['Patrick_Hand'] text-xs sm:text-sm text-stone-800">
                Giliran:{' '}
                <strong className="text-rose-600 font-bold underline decoration-wavy decoration-rose-300">
                  {currentActiveName}
                </strong>{' '}
                {playMode === 'online' && isMyTurn ? '(Kamu)' : ''}
              </span>
            </div>
          </div>

          {/* Center Card Display (Always fits nicely in viewport) */}
          <main className="flex-1 flex items-center justify-center my-auto min-h-0 py-1">
            <DoodleCard
              card={activeCard}
              isFlipped={isFlipped}
              onFlip={handleFlipCard}
              isFavorite={favoritedCardIds.includes(activeCard.id)}
              onToggleFavorite={handleToggleFavorite}
              activePlayerName={currentActiveName}
              isMyTurn={isMyTurn}
              isOnlineMode={playMode === 'online'}
              cardNumber={currentIndex + 1}
              totalCards={cardOrder.length}
            />
          </main>

          {/* Action Control Buttons (Doodle Style) */}
          <div className="mt-1 space-y-1.5 shrink-0">
            {/* Primary Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* Tanya Balik Button */}
              <button
                onClick={handleReverseTurn}
                className="py-2 px-1.5 bg-white hover:bg-stone-50 text-stone-800 doodle-border-sm doodle-shadow-sm doodle-btn rounded-xl flex flex-col items-center justify-center gap-0.5 text-center"
                title="Tukar giliran agar pasangan juga menjawab pertanyaan ini"
              >
                <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-['Patrick_Hand'] text-xs font-bold leading-tight">
                  Tanya Balik
                </span>
              </button>

              {/* Lanjut Kartu Baru Button (Main Highlight) */}
              <button
                onClick={handleNextCard}
                className="py-2 px-2 bg-[#FFE882] hover:bg-[#ffdf66] text-[#2B2523] doodle-border doodle-shadow doodle-btn rounded-xl flex flex-col items-center justify-center gap-0.5 text-center"
              >
                <ArrowRight className="w-4 h-4 text-stone-900" />
                <span className="font-['Patrick_Hand'] text-xs sm:text-sm font-bold leading-tight">
                  Kartu Berikutnya
                </span>
              </button>

              {/* Skip / Lewati Button */}
              <button
                onClick={handleSkipCard}
                className="py-2 px-1.5 bg-white hover:bg-stone-50 text-stone-600 doodle-border-sm doodle-shadow-sm doodle-btn rounded-xl flex flex-col items-center justify-center gap-0.5 text-center"
                title="Lewati jika pertanyaan ini belum nyaman dibahas"
              >
                <SkipForward className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-['Patrick_Hand'] text-xs font-bold leading-tight">
                  Lewati Kartu
                </span>
              </button>
            </div>

            {/* Floating Reactions Bar */}
            <div className="pt-0.5">
              <DoodleReactions
                onSendReaction={handleSendReaction}
                incomingReaction={incomingReaction}
              />
            </div>

            {/* Bottom Progress Bar */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400 font-['Patrick_Hand'] px-1">
              <button
                onClick={handlePrevCard}
                disabled={currentIndex === 0}
                className="hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 flex items-center gap-0.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Sebelumnya</span>
              </button>

              <span>
                {currentIndex + 1} / {cardOrder.length} kartu
              </span>

              {skippedCount > 0 ? (
                <span className="text-stone-400">
                  ({skippedCount} dilewati)
                </span>
              ) : (
                <span className="text-transparent">.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recap & Celebration Modal */}
      <RecapModal
        isOpen={isRecapOpen}
        onRestart={handleRestartSession}
        onGoToMenu={handleGoToMenu}
        cardsExplored={currentIndex + 1}
        favoritedCards={favoritedCardsList}
        player1Name={hostPlayerName}
        player2Name={guestPlayerName}
        sessionDurationMinutes={sessionMinutes}
      />
    </div>
  );
};

export default App;
