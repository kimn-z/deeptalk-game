# Dua Hati — Deeptalk Card Game Pasangan (Hand-Drawn & Serverless) 💕

Game kartu percakapan intim (*deeptalk card game*) berbasis website bertema **Hand-Drawn / Doodle Style** yang dapat dimainkan oleh **2 pemain secara real-time** tanpa memerlukan server backend terpisah (100% Serverless via WebRTC).

---

## ✨ Fitur Utama

- **100% Serverless & Realtime Sync (WebRTC):**
  - Menggunakan WebRTC DataChannels (PeerJS) untuk menghubungkan 2 perangkat langsung antar-browser secara instan tanpa biaya server.
  - Cukup buat ruangan, bagikan kode room atau tautan (termasuk tombol 1-klik kirim ke WhatsApp).
- **Mode Satu Layar (Pass-and-Play):**
  - Opsi bermain bersama di satu layar ponsel atau laptop saat sedang duduk berdampingan di kafe atau kasur.
- **5 Kategori & Level Kartu Mendalam:**
  - **Level 1: Percikan & Kenangan 🌱** — Nostalgia awal mula, hal-hal manis, dan kebiasaan yang menggemaskan.
  - **Level 2: Rasa & Karakter 💕** — *Love language*, apresiasi tersembunyi, insecurities, dan emosi.
  - **Level 3: Rentan & Kejujuran 🕯️** — Ruang aman membicarakan luka masa lalu, ketakutan terbesar, dan saling memaafkan.
  - **Level 4: Masa Depan & Janji 🏠** — Visi masa depan, rumah impian, menua bersama, dan komitmen.
  - **Special Deck: Tebak Pasangan 🎯** — Format unik: *Pemain menebak jawaban pasangannya lebih dulu sebelum pasangan menjawab aslinya*.
- **Desain Hand-Drawn / Doodle Aesthetic:**
  - Tekstur kertas hangat, bingkai sketsa tangan (*wobbly doodle borders*), aksen pita selotip (*washi tape*), dan bayangan sketsa.
  - Animasi 3D flip kartu saat disentuh.
  - Floating emoji reactions (❤️, 🥺, ✨, ☕, 🫂, 🎯) yang sinkron secara realtime di layar pasangan.
  - Efek suara sintetis alami via Web Audio API (suara kertas, klik kayu lembut, chime bintang favorit, pop emoji).
  - Tampilan *zero-scroll* (semua tombol tindakan pas dalam satu layar HP tanpa perlu scroll ke bawah).
- **Rangkuman Sesi (Recap Modal):**
  - Selebrasi konfeti, total waktu mengobrol, dan daftar kartu yang ditandai bintang ⭐.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Hand-Drawn Doodle Utilities
- **Animation:** Framer Motion
- **Networking:** PeerJS (WebRTC DataChannel P2P)
- **Audio:** Synthesized Web Audio API
- **Icons & Extras:** Lucide React, Canvas Confetti

---

## 🚀 Menjalankan Secara Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/<username>/deeptalk-game.git
   cd deeptalk-game
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173/` di peramban Anda.

---

## 🌐 Cara Deploy ke GitHub Pages

### Opsi A: Otomatis via GitHub Actions (Direkomendasikan)
Repositori ini telah dilengkapi workflow `.github/workflows/deploy.yml`. 
Cukup buka repositori di GitHub:
1. Masuk ke **Settings** > **Pages**.
2. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
3. Lakukan `git push origin main`, GitHub Actions akan otomatis mem-build dan merilis situs Anda!

### Opsi B: Manual via NPM Script
```bash
npm run deploy
```

---

Dibuat dengan ❤️ untuk menciptakan obrolan yang lebih bermakna bersama pasangan.
