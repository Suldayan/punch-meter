import { useWebSocket } from './hooks/useWebSocket';
import { useGameState } from './hooks/useGameState';
import { useGameRoom } from './hooks/useGameRoom';
import { useGameController } from './hooks/useGameController';
import { useWebSocketSubscription } from './hooks/useWebSocketSubscription';
import MenuScreen from './pages/MenuScreen';
import CreateRoomScreen from './pages/CreateRoomScreen';
import JoinRoomScreen from './pages/JoinRoomScreen';
import { LobbyScreen } from './pages/LobbyScreen';
import { ControllerView } from './pages/ControllerView';
import LoadingScreen from './pages/LoadingScreen';

export default function App() {
  const { isConnected } = useWebSocket();
  const { gameState, goToMenu, goToCreateRoom, goToJoinRoom, goToLobby, goToControllerView, goToPlaying } = useGameState();
  const { 
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
  } = useGameRoom();
  const { handleControllerInput, handlePunch, handleReady } = useGameController(gameRoom, currentPlayer);

  // Set up WebSocket subscriptions
  useWebSocketSubscription(isHost, gameRoom, currentPlayer, handleControllerInput, updateRoomState);

  const handleHostGame = (): void => {
    setIsHost(true);
    goToCreateRoom();
  };

  const handleJoinGame = (): void => {
    setIsHost(false);
    goToJoinRoom();
  };

  const handleCreateRoom = async (roomName: string): Promise<void> => {
    await createRoom(roomName);
    goToLobby();
  };

  const handleJoinRoom = async (roomCode: string, playerName: string): Promise<void> => {
    try {
      await joinRoom(roomCode, playerName);
      goToControllerView();
    } catch (error) {
      // Handle error in UI
      console.error('Failed to join room:', error);
    }
  };

  const handleStartGame = (): void => {
    startGame();
    goToPlaying();
  };

  const handleBack = (): void => {
    resetRoom();
    goToMenu();
  };

  const handleReadyToggle = (): void => {
    handleReady();
    setCurrentPlayer(prev => prev ? { ...prev, isReady: !prev.isReady } : null);
  };

  if (!isConnected) {
    return <LoadingScreen />;
  }

  switch (gameState) {
    case 'menu':
      return <MenuScreen onHostGame={handleHostGame} onJoinGame={handleJoinGame} />;
    case 'createRoom':
      return <CreateRoomScreen onBack={handleBack} onCreateRoom={handleCreateRoom} />;
    case 'joinRoom':
      return <JoinRoomScreen onBack={handleBack} onJoinRoom={handleJoinRoom} />;
    case 'lobby':
      return <LobbyScreen gameRoom={gameRoom} onStartGame={handleStartGame} />;
    case 'controllerView':
      return (
        <ControllerView
          roomCode={gameRoom.roomCode}
          playerName={currentPlayer?.playerName || ''}
          currentScore={currentPlayer?.score || 0}
          attemptsRemaining={3}
          onPunch={handlePunch}
          onReady={handleReadyToggle}
          isReady={currentPlayer?.isReady || false}
          isPlayerTurn={true}
        />
      );
    default:
      return <MenuScreen onHostGame={handleHostGame} onJoinGame={handleJoinGame} />;
  }
};
