import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { type GameRoom, type Player, type Subscription, type WebSocketMessage, type ControllerInputData, type RoomStateData } from '../types';

export const useWebSocketSubscription = (
  isHost: boolean,
  gameRoom: GameRoom,
  currentPlayer: Player | null,
  handleControllerInput: (inputData: ControllerInputData) => void,
  updateRoomState: (roomState: RoomStateData) => void
) => {
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const subscriptions: Subscription[] = [];

    if (isHost && gameRoom.roomCode) {
      // Host subscriptions
      const hostSub = subscribe(`/topic/room/${gameRoom.roomCode}/host`, (data: WebSocketMessage) => {
        console.log('Host received:', data);
        if (data.inputType) {
          handleControllerInput(data as ControllerInputData);
        } else if (data.roomCode) {
          updateRoomState(data as RoomStateData);
        }
      });

      const updatesSub = subscribe(`/topic/room/${gameRoom.roomCode}/updates`, (data: WebSocketMessage) => {
        console.log('Room updates:', data);
        if (data.roomState) {
          updateRoomState(data.roomState);
        }
      });

      if (hostSub) subscriptions.push(hostSub);
      if (updatesSub) subscriptions.push(updatesSub);
    } else if (!isHost && gameRoom.roomCode && currentPlayer) {
      // Controller subscriptions
      const controllerSub = subscribe(`/topic/room/${gameRoom.roomCode}/controller/${currentPlayer.deviceId}`, (data: WebSocketMessage) => {
        console.log('Controller received:', data);
        if (data.error) {
          console.error('Controller error:', data.error);
        }
      });

      if (controllerSub) subscriptions.push(controllerSub);
    }

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [isConnected, isHost, gameRoom.roomCode, currentPlayer, handleControllerInput, updateRoomState, subscribe]);
};

