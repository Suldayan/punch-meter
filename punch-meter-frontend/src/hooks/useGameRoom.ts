import { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { type GameRoom, type Player, type RoomStateData, type WebSocketMessage } from '../types';

export const useGameRoom = () => {
  const [gameRoom, setGameRoom] = useState<GameRoom>({
    roomCode: '',
    roomName: '',
    players: [],
    maxPlayers: 4,
    isGameStarted: false
  });
  const [isHost, setIsHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const { isConnected, sendMessage, subscribe } = useWebSocket();

  const updateRoomState = (roomState: RoomStateData): void => {
    setGameRoom(prev => ({
      ...prev,
      roomCode: roomState.roomCode,
      roomName: roomState.roomName,
      players: roomState.players?.map(p => ({
        playerName: p.playerName,
        deviceId: p.deviceId,
        status: p.status,
        isReady: p.isReady,
        score: p.score
      } as Player)) || [],
      maxPlayers: roomState.maxPlayers
    }));
  };

  const createRoom = async (roomName: string): Promise<void> => {
    if (!isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      const deviceId = 'host-' + Math.random().toString(36).slice(2, 9);
      
      sendMessage('/app/room/create', {
        roomName,
        deviceId
      });

      const hostSub = subscribe('/topic/room/*/host', (data: WebSocketMessage) => {
        console.log('Room created:', data);
        setGameRoom({
          roomCode: data.roomCode || '',
          roomName: data.roomName || '',
          players: data.players?.map(p => ({
            playerName: p.playerName,
            deviceId: p.deviceId,
            status: p.status,
            isReady: p.isReady,
            score: p.score
          } as Player)) || [],
          maxPlayers: data.maxPlayers || 4,
          isGameStarted: false
        });
        hostSub?.unsubscribe();
      });

    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const joinRoom = async (roomCode: string, playerName: string): Promise<void> => {
    if (!isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:8080';
      
      const roomExistsResponse = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/exists`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!roomExistsResponse.ok) {
        const errorText = await roomExistsResponse.text();
        throw new Error(`HTTP error! status: ${roomExistsResponse.status}, body: ${errorText}`);
      }
      
      const responseText = await roomExistsResponse.text();
      let roomExists: boolean;
      try {
        roomExists = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (!roomExists) {
        throw new Error('Room not found');
      }

      const deviceId = Math.random().toString(36).substring(2, 15);
      
      sendMessage('/app/room/join', {
        roomCode,
        playerName,
        deviceId
      });

      const player: Player = {
        playerName,
        deviceId,
        status: 'CONNECTED',
        isReady: false,
        score: 0
      };

      setCurrentPlayer(player);
      setGameRoom(prev => ({
        ...prev,
        roomCode
      }));

    } catch (error) {
      console.error('Failed to join room:', error);
      throw error; // Re-throw to let component handle UI feedback
    }
  };

  const resetRoom = () => {
    setGameRoom({
      roomCode: '',
      roomName: '',
      players: [],
      maxPlayers: 4,
      isGameStarted: false
    });
    setCurrentPlayer(null);
    setIsHost(false);
  };

  const startGame = () => {
    setGameRoom(prev => ({ ...prev, isGameStarted: true }));
  };

  return {
    gameRoom,
    isHost,
    currentPlayer,
    setIsHost,
    setCurrentPlayer,
    updateRoomState,
    createRoom,
    joinRoom,
    resetRoom,
    startGame
  };
};