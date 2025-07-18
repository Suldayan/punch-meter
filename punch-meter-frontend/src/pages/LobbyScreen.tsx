import React from 'react';
import PlayerList from '../components/PlayerList';
import GameInstructions from '../components/GameInstructions';
import { type GameRoom } from '../types';
import { Wifi, Users, Gamepad2 } from 'lucide-react';

interface LobbyScreenProps {
  gameRoom: GameRoom;
  onStartGame: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ gameRoom, onStartGame }) => {
  const canStartGame = gameRoom.players.length > 0 && gameRoom.players.every(p => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-pink-300/20 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-yellow-300/30 rounded-full blur-md animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-300/15 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section with room info */}
        <div className="text-center mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border-2 border-white/50 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-cyan-400 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-pink-400 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"></div>
            
            {/* Room status indicator */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
              <Wifi className="w-4 h-4 mr-1" />
              ONLINE
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-cyan-600 mr-3" />
                <h1 className="text-4xl font-black text-gray-800 tracking-wide">
                  {gameRoom.roomName}
                </h1>
              </div>
              
              {/* Room code */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-4 shadow-lg">
                <div className="text-white text-lg font-bold mb-2">ROOM CODE</div>
                <div className="text-5xl font-black text-white tracking-[0.5em] drop-shadow-lg">
                  {gameRoom.roomCode}
                </div>
              </div>
              
              <p className="text-gray-600 font-medium">
                Players join using this code on their phones
              </p>
              
              {/* Connection info */}
              <div className="mt-4 text-sm text-gray-500">
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full mr-2">
                  📱 Mobile Controller
                </span>
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">
                  🎮 Party Mode
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player List Section */}
          <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg mr-4">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-wide drop-shadow-lg">
                      PLAYERS
                    </h2>
                    <p className="text-white/80 text-sm">
                      {gameRoom.players.length} / {gameRoom.maxPlayers} joined
                    </p>
                  </div>
                </div>
                
                {/* Player count badge */}
                <div className="bg-white/90 px-4 py-2 rounded-full">
                  <span className="text-pink-600 font-bold">
                    {gameRoom.players.length}/{gameRoom.maxPlayers}
                  </span>
                </div>
              </div>
              
              {/* Player list container */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-h-[300px]">
                <PlayerList players={gameRoom.players} maxPlayers={gameRoom.maxPlayers} />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 text-white/40 text-xs">
                {Math.round((gameRoom.players.length / gameRoom.maxPlayers) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Game Instructions Section */}
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Section header */}
              <div className="flex items-center mb-6">
                <div className="bg-white/90 p-3 rounded-full shadow-lg mr-4">
                  <Gamepad2 className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide drop-shadow-lg">
                    GAME READY
                  </h2>
                  <p className="text-white/80 text-sm">
                    {canStartGame ? 'All players ready!' : 'Waiting for players...'}
                  </p>
                </div>
              </div>
              
              {/* Instructions container */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-h-[300px]">
                <GameInstructions onStartGame={onStartGame} canStartGame={canStartGame} />
              </div>
              
              {/* Start game button */}
              <div className="mt-6">
                <button
                  onClick={onStartGame}
                  disabled={!canStartGame}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 ${
                    canStartGame
                      ? 'bg-white/90 hover:bg-white text-cyan-600 hover:shadow-xl transform hover:scale-105'
                      : 'bg-white/30 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {canStartGame ? '🎮 START GAME' : '⏳ WAITING FOR PLAYERS'}
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 text-white/40 text-xs">
                Ready: {gameRoom.players.filter(p => p.isReady).length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
            <p className="text-white text-sm font-medium">
              🎯 Punch Meter • 🎮 Party Game • 📱 Mobile Controllers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};