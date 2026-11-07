import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

export interface GameSyncState {
  cardOrder: string[]; // array of card IDs in shuffled order
  currentIndex: number;
  isFlipped: boolean;
  activePlayer: 'host' | 'guest'; // who is currently answering or asking
  hostName: string;
  guestName: string;
  favoritedIds: string[];
  skippedCount: number;
  startedAt: number;
  isFinished: boolean;
}

export type NetworkMessage =
  | { type: 'JOIN'; playerName: string }
  | { type: 'SYNC_STATE'; state: GameSyncState }
  | { type: 'FLIP_CARD'; isFlipped: boolean }
  | { type: 'NEXT_CARD'; nextIndex: number; newTurn: 'host' | 'guest' }
  | { type: 'PREV_CARD'; prevIndex: number }
  | { type: 'REVERSE_TURN'; newTurn: 'host' | 'guest' }
  | { type: 'SKIP_CARD'; nextIndex: number }
  | { type: 'TOGGLE_FAVORITE'; cardId: string; favoritedIds: string[] }
  | { type: 'REACTION'; emoji: string; sender: string }
  | { type: 'FINISH_SESSION' }
  | { type: 'RESTART_SESSION'; state: GameSyncState };

export class PeerService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  public myPeerId: string = '';
  public isHost: boolean = false;
  private onMessageCallbacks: ((msg: NetworkMessage) => void)[] = [];
  private onStatusChangeCallbacks: ((status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error', err?: string) => void)[] = [];

  // Prefix to avoid conflicts on public peerjs broker
  private static PREFIX = 'dtc-2026-';

  public static formatRoomId(raw: string): string {
    return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  // Create room as Host
  public createRoom(
    roomCode: string,
    _hostName: string,
    onReady: (fullCode: string) => void,
    onError: (err: string) => void
  ) {
    this.isHost = true;
    const fullPeerId = `${PeerService.PREFIX}${roomCode}`;

    this.peer = new Peer(fullPeerId, {
      debug: 1,
    });

    this.peer.on('open', (id) => {
      this.myPeerId = id;
      this.notifyStatus('connecting');
      onReady(roomCode);
    });

    this.peer.on('connection', (conn) => {
      this.connection = conn;
      this.setupConnectionHandlers();
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Host Error:', err);
      let errorMsg = err.message || 'Gagal membuat ruangan.';
      if (err.type === 'unavailable-id') {
        errorMsg = 'Kode ruangan ini sedang digunakan. Coba buat kode lain atau acak kode baru!';
      }
      this.notifyStatus('error', errorMsg);
      onError(errorMsg);
    });
  }

  // Join room as Guest
  public joinRoom(
    roomCode: string,
    guestName: string,
    onSuccess: () => void,
    onError: (err: string) => void
  ) {
    this.isHost = false;
    const targetPeerId = `${PeerService.PREFIX}${roomCode}`;

    // Guest gets an auto-generated random ID
    this.peer = new Peer({
      debug: 1,
    });

    this.peer.on('open', (id) => {
      this.myPeerId = id;
      this.notifyStatus('connecting');

      const conn = this.peer!.connect(targetPeerId, {
        reliable: true,
      });

      this.connection = conn;
      this.setupConnectionHandlers(() => {
        // Send initial greeting to host
        this.send({ type: 'JOIN', playerName: guestName });
        onSuccess();
      });
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Guest Error:', err);
      const errorMsg = 'Tidak dapat terhubung ke ruangan. Pastikan kode benar & Host sedang online.';
      this.notifyStatus('error', errorMsg);
      onError(errorMsg);
    });
  }

  private setupConnectionHandlers(onOpenCallback?: () => void) {
    if (!this.connection) return;

    this.connection.on('open', () => {
      this.notifyStatus('connected');
      if (onOpenCallback) onOpenCallback();
    });

    this.connection.on('data', (data) => {
      try {
        const msg = data as NetworkMessage;
        this.onMessageCallbacks.forEach((cb) => cb(msg));
      } catch (e) {
        console.error('Error handling message:', e);
      }
    });

    this.connection.on('close', () => {
      this.notifyStatus('disconnected', 'Pasanganmu keluar dari ruangan.');
    });

    this.connection.on('error', (err) => {
      console.error('Connection error:', err);
      this.notifyStatus('error', 'Koneksi terganggu.');
    });
  }

  public send(msg: NetworkMessage) {
    if (this.connection && this.connection.open) {
      this.connection.send(msg);
    }
  }

  public onMessage(cb: (msg: NetworkMessage) => void) {
    this.onMessageCallbacks.push(cb);
    return () => {
      this.onMessageCallbacks = this.onMessageCallbacks.filter((c) => c !== cb);
    };
  }

  public onStatusChange(cb: (status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error', err?: string) => void) {
    this.onStatusChangeCallbacks.push(cb);
    return () => {
      this.onStatusChangeCallbacks = this.onStatusChangeCallbacks.filter((c) => c !== cb);
    };
  }

  private notifyStatus(status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error', err?: string) {
    this.onStatusChangeCallbacks.forEach((cb) => cb(status, err));
  }

  public disconnect() {
    if (this.connection) {
      try {
        this.connection.close();
      } catch {}
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
    this.notifyStatus('idle');
  }
}

export const peerService = new PeerService();
