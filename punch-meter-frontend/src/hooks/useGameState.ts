import { useState } from 'react';
import { type GameState } from '../types';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('menu');

  const goToMenu = () => setGameState('menu');
  const goToCreateRoom = () => setGameState('createRoom');
  const goToJoinRoom = () => setGameState('joinRoom');
  const goToLobby = () => setGameState('lobby');
  const goToControllerView = () => setGameState('controllerView');
  const goToPlaying = () => setGameState('playing');

  return {
    gameState,
    goToMenu,
    goToCreateRoom,
    goToJoinRoom,
    goToLobby,
    goToControllerView,
    goToPlaying
  };
};