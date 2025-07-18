import { useWebSocket } from './useWebSocket';
import { type Player, type ControllerInputData } from '../types';

export const useGameController = (gameRoom: any, currentPlayer: Player | null) => {
  const { isConnected, sendMessage } = useWebSocket();

  const handleControllerInput = (inputData: ControllerInputData): void => {
    console.log('Controller input received:', inputData);
    switch (inputData.inputType) {
      case 'READY':
        // Update player ready status
        break;
      case 'UNREADY':
        // Update player unready status
        break;
      case 'PUNCH':
        // Handle punch input
        break;
      default:
        console.log('Unknown input type:', inputData.inputType);
    }
  };

  const handlePunch = (): void => {
    if (!isConnected || !currentPlayer) return;

    sendMessage('/app/controller/input', {
      roomCode: gameRoom.roomCode,
      deviceId: currentPlayer.deviceId,
      inputType: 'PUNCH',
      data: { timestamp: Date.now() }
    });

    console.log('Punch sent!');
  };

  const handleReady = (): void => {
    if (!isConnected || !currentPlayer) return;

    const newReadyState = !currentPlayer.isReady;
    
    sendMessage('/app/controller/input', {
      roomCode: gameRoom.roomCode,
      deviceId: currentPlayer.deviceId,
      inputType: newReadyState ? 'READY' : 'UNREADY',
      data: { ready: newReadyState }
    });
  };

  return {
    handleControllerInput,
    handlePunch,
    handleReady
  };
};