export interface Player {
  playerName: string;
  deviceId: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  isReady: boolean;
  score: number;
}

export interface GameRoom {
  roomCode: string;
  roomName: string;
  players: Player[];
  maxPlayers: number;
  isGameStarted: boolean;
}

export interface ControllerInputData {
  inputType: 'READY' | 'UNREADY' | 'PUNCH';
  roomCode: string;
  deviceId: string;
  data?: {
    ready?: boolean;
    timestamp?: number;
  };
  error?: string;
}

export interface RoomStateData {
  roomCode: string;
  roomName: string;
  players: Array<{
    playerName: string;
    deviceId: string;
    status: string;
    isReady: boolean;
    score: number;
  }>;
  maxPlayers: number;
}

export interface WebSocketMessage {
  inputType?: 'READY' | 'UNREADY' | 'PUNCH';
  roomCode?: string;
  roomName?: string;
  players?: Array<{
    playerName: string;
    deviceId: string;
    status: string;
    isReady: boolean;
    score: number;
  }>;
  maxPlayers?: number;
  roomState?: RoomStateData;
  error?: string;
}

export interface Subscription {
  unsubscribe: () => void;
}

export type GameState = 'menu' | 'createRoom' | 'joinRoom' | 'lobby' | 'playing' | 'controllerView' | 'results';
