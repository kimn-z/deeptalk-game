import React, { useState, useEffect } from "react";
import type { CardItem } from "../data/cards";
import { DeckSelector } from "./DeckSelector";
import { DoodleIcon, DoodleUnderline } from "./DoodleIcons";
import { sounds } from "../utils/audio";
import { Share2, Copy, Check, Users, Smartphone, Sparkles, Volume2, VolumeX, ArrowRight } from "lucide-react";

interface LobbyViewProps {
  cards: CardItem[];
  selectedLevels: (1 | 2 | 3 | 4 | "guess")[];
  onToggleLevel: (level: 1 | 2 | 3 | 4 | "guess") => void;
  onStartPassAndPlay: (p1: string, p2: string) => void;
  onCreateOnlineRoom: (hostName: string, roomCode: string) => void;
  onJoinOnlineRoom: (guestName: string, roomCode: string) => void;
  onlineStatus: "idle" | "connecting" | "connected" | "disconnected" | "error";
  onlineError?: string;
  isHostWaiting: boolean;
  activeRoomCode: string;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ cards, selectedLevels, onToggleLevel, onStartPassAndPlay, onCreateOnlineRoom, onJoinOnlineRoom, onlineStatus, onlineError, isHostWaiting, activeRoomCode }) => {
  // Mode: 'online' | 'local'
  const [playMode, setPlayMode] = useState<"online" | "local">("online");
  const [onlineTab, setOnlineTab] = useState<"create" | "join">("create");

  // Input states
  const [player1Name, setPlayer1Name] = useState("Aku");
  const [player2Name, setPlayer2Name] = useState("Kamu");
  const [myOnlineName, setMyOnlineName] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auto detect ?room= query param from URL on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const roomFromUrl = urlParams.get("room");
      if (roomFromUrl) {
        setPlayMode("online");
        setOnlineTab("join");
        setInputRoomCode(roomFromUrl.toUpperCase().trim());
      }
    }
  }, []);

  const generateRandomCode = () => {
    const words = ["KITA", "RASA", "CINTA", "DUA", "JANJI", "KASIH"];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${word}${num}`;
  };

  const [generatedCode] = useState(() => generateRandomCode());

  const handleCopyLink = () => {
    const code = activeRoomCode || generatedCode;
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    sounds.playTap();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const code = activeRoomCode || generatedCode;
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
    const text = encodeURIComponent(`Hai sayang, yuk main deeptalk card berdua sama aku! Buka link ini ya: ${shareUrl} (Kode Room: ${code})`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Top Header / Branding */}
      <div className="text-center relative mb-8">
        {/* Sound toggle button at top right */}
        <button
          onClick={toggleSound}
          className="absolute -top-2 right-0 p-2.5 rounded-full doodle-border-sm bg-white doodle-shadow-sm text-stone-600 hover:text-stone-900 doodle-btn"
          title={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-rose-500" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
        </button>

        <h1 className="font-['Patrick_Hand'] text-4xl sm:text-5xl font-black text-[#2B2523] tracking-wide relative inline-block">
          Dua Hati
          <div className="absolute -bottom-2 left-0 right-0">
            <DoodleUnderline color="#FF9EAA" className="w-full h-3" />
          </div>
        </h1>

        <p className="font-['Gaegu'] text-lg sm:text-xl text-stone-600 mt-3 font-bold">Kartu Percakapan & Deeptalk untuk Mengenal Lebih Dalam</p>
      </div>

      {/* Main Mode Toggle: Online 2 Pemain vs Satu Layar */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => {
            sounds.playTap();
            setPlayMode("online");
          }}
          className={`p-3.5 rounded-2xl doodle-border doodle-btn flex flex-col items-center justify-center gap-1 text-center ${
            playMode === "online" ? "bg-[#FFE882] text-stone-900 doodle-shadow" : "bg-white text-stone-500 opacity-70 hover:opacity-100 border-stone-300"
          }`}
        >
          <div className="flex items-center gap-1.5 font-['Patrick_Hand'] text-lg font-bold">
            <Users className="w-5 h-5" />
            <span>Online (2 HP/Laptop)</span>
          </div>
          <span className="text-[11px] text-stone-600 font-medium">Beda perangkat jarak jauh</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setPlayMode("local");
          }}
          className={`p-3.5 rounded-2xl doodle-border doodle-btn flex flex-col items-center justify-center gap-1 text-center ${
            playMode === "local" ? "bg-[#FFE882] text-stone-900 doodle-shadow" : "bg-white text-stone-500 opacity-70 hover:opacity-100 border-stone-300"
          }`}
        >
          <div className="flex items-center gap-1.5 font-['Patrick_Hand'] text-lg font-bold">
            <Smartphone className="w-5 h-5" />
            <span>Satu Layar (Barengan)</span>
          </div>
          <span className="text-[11px] text-stone-600 font-medium">Duduk berdampingan</span>
        </button>
      </div>

      {/* Card Content based on Mode */}
      <div className="bg-[#FFFDF9] doodle-border doodle-shadow-lg p-6 sm:p-7 rounded-[28px] mb-8 relative">
        <div className="washi-tape" />

        {/* ================= MODE ONLINE ================= */}
        {playMode === "online" && (
          <div>
            {/* Host waiting screen */}
            {isHostWaiting ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF0D7] doodle-border flex items-center justify-center mx-auto mb-3 animate-bounce">
                  <DoodleIcon name="heart" className="w-7 h-7 text-rose-500" />
                </div>

                <h3 className="font-['Patrick_Hand'] text-2xl font-bold text-stone-900">Ruangan Berhasil Dibuat!</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">Bagikan kode atau link ini ke pasanganmu. Permainan akan otomatis dimulai saat pasanganmu bergabung!</p>

                {/* Big Room Code Box */}
                <div className="my-5 p-4 bg-[#FAF7F2] doodle-border rounded-2xl max-w-xs mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block font-['Patrick_Hand']">Kode Ruangan Kalian</span>
                  <div className="text-3xl font-black tracking-widest text-rose-600 font-mono mt-1">{activeRoomCode}</div>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-4 bg-white doodle-border-sm doodle-shadow-sm doodle-btn rounded-xl font-['Patrick_Hand'] font-bold text-stone-800 text-sm flex items-center justify-center gap-2"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "Link Tersalin!" : "Salin Link"}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 py-2.5 px-4 bg-[#25D366] text-white doodle-border-sm doodle-shadow-sm doodle-btn rounded-xl font-['Patrick_Hand'] font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Animated waiting spinner */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500 italic">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Menunggu pasangan bergabung...</span>
                </div>
              </div>
            ) : (
              <div>
                {/* Online Tabs: Buat Room vs Gabung */}
                <div className="flex border-b-2 border-stone-200 mb-5">
                  <button
                    onClick={() => setOnlineTab("create")}
                    className={`flex-1 py-2 text-base font-['Patrick_Hand'] font-bold text-center border-b-2 -mb-[2px] transition-colors ${
                      onlineTab === "create" ? "border-rose-500 text-rose-600" : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    1. Buat Ruangan
                  </button>
                  <button
                    onClick={() => setOnlineTab("join")}
                    className={`flex-1 py-2 text-base font-['Patrick_Hand'] font-bold text-center border-b-2 -mb-[2px] transition-colors ${
                      onlineTab === "join" ? "border-rose-500 text-rose-600" : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    2. Gabung Ruangan
                  </button>
                </div>

                {onlineError && <div className="mb-4 p-3 bg-rose-50 doodle-border-sm rounded-xl text-xs text-rose-700 font-medium">⚠️ {onlineError}</div>}

                {onlineTab === "create" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold font-['Patrick_Hand'] text-stone-700 uppercase tracking-wider mb-1">Panggilan Kamu</label>
                      <input
                        type="text"
                        placeholder="Contoh: Sayang"
                        value={myOnlineName}
                        onChange={(e) => setMyOnlineName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white doodle-border-sm rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div className="p-3 bg-[#FAF7F2] doodle-border-sm rounded-xl text-xs text-stone-600">
                      <span className="font-bold font-['Patrick_Hand'] block text-stone-800">Kode Ruangan Otomatis:</span>
                      <span className="font-mono text-base font-bold text-rose-600">{generatedCode}</span>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        const name = myOnlineName.trim() || "Pemain 1";
                        onCreateOnlineRoom(name, generatedCode);
                      }}
                      disabled={onlineStatus === "connecting"}
                      className="w-full py-3.5 bg-[#FF9EAA] hover:bg-[#ff8c9a] text-[#2B2523] doodle-border doodle-shadow-sm doodle-btn font-['Patrick_Hand'] text-xl font-bold rounded-2xl flex items-center justify-center gap-2"
                    >
                      {onlineStatus === "connecting" ? (
                        <span>Sedang Menyiapkan Ruangan...</span>
                      ) : (
                        <>
                          <span>Buat Ruangan & Dapatkan Link</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold font-['Patrick_Hand'] text-stone-700 uppercase tracking-wider mb-1">Panggilan Kamu</label>
                      <input
                        type="text"
                        placeholder="Contoh: Dinda / Manis"
                        value={myOnlineName}
                        onChange={(e) => setMyOnlineName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white doodle-border-sm rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-['Patrick_Hand'] text-stone-700 uppercase tracking-wider mb-1">Masukkan Kode Ruangan dari Pasangan</label>
                      <input
                        type="text"
                        placeholder="Contoh: KITA42"
                        value={inputRoomCode}
                        onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-white doodle-border-sm rounded-xl font-mono text-base font-bold text-rose-600 tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        const name = myOnlineName.trim() || "Pemain 2";
                        onJoinOnlineRoom(name, inputRoomCode.trim());
                      }}
                      disabled={!inputRoomCode.trim() || onlineStatus === "connecting"}
                      className="w-full py-3.5 bg-[#97CBA9] hover:bg-[#85c098] text-[#2B2523] doodle-border doodle-shadow-sm doodle-btn font-['Patrick_Hand'] text-xl font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {onlineStatus === "connecting" ? (
                        <span>Menghubungkan ke Ruangan...</span>
                      ) : (
                        <>
                          <span>Gabung ke Meja Pasangan</span>
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= MODE LOCAL (SATU LAYAR) ================= */}
        {playMode === "local" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold font-['Patrick_Hand'] text-stone-700 uppercase tracking-wider mb-1">Nama Pemain 1</label>
                <input type="text" placeholder="Nama Pemain 1" value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} className="w-full px-3 py-2 bg-white doodle-border-sm rounded-xl font-medium text-sm focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold font-['Patrick_Hand'] text-stone-700 uppercase tracking-wider mb-1">Nama Pemain 2</label>
                <input type="text" placeholder="Nama Pemain 2" value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} className="w-full px-3 py-2 bg-white doodle-border-sm rounded-xl font-medium text-sm focus:outline-none" />
              </div>
            </div>

            <p className="text-xs text-stone-500 italic text-center">Cocok saat kalian sedang berdua di kafe, kasur, atau perjalanan santai.</p>

            <button
              onClick={() => {
                sounds.playTap();
                onStartPassAndPlay(player1Name.trim() || "Pemain 1", player2Name.trim() || "Pemain 2");
              }}
              className="w-full py-3.5 bg-[#FFE882] text-stone-900 doodle-border doodle-shadow-sm doodle-btn font-['Patrick_Hand'] text-xl font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <span>Mulai Main di Layar Ini</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Deck Selector Section */}
      <DeckSelector cards={cards} selectedLevels={selectedLevels} onToggleLevel={onToggleLevel} />
    </div>
  );
};
