import React from 'react';
import { Zap } from 'lucide-react';

interface ControllerViewProps {
  roomCode: string;
  playerName: string;
  currentScore: number;
  attemptsRemaining: number;
  onPunch: () => void;
  onReady: () => void;
  isReady: boolean;
  isPlayerTurn: boolean;
}

export const ControllerView: React.FC<ControllerViewProps> = ({
  roomCode,
  playerName,
  currentScore,
  attemptsRemaining,
  onPunch,
  onReady,
  isReady,
  isPlayerTurn
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{playerName}</h2>
          <p className="text-gray-600">Room: {roomCode}</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-bold text-gray-800 mb-3">
              {isPlayerTurn ? 'Your Turn' : 'Wait for your turn'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isPlayerTurn ? 'Hold phone and swing to punch!' : 'Watch the screen for results'}
            </p>
            
            <button
              onClick={onPunch}
              disabled={!isPlayerTurn || attemptsRemaining === 0}
              className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PUNCH
            </button>
          </div>

          <div className="flex justify-between text-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-800">{currentScore}</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-800">{attemptsRemaining}</div>
              <div className="text-sm text-gray-600">Attempts</div>
            </div>
          </div>

          <button
            onClick={onReady}
            disabled={isReady}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReady ? 'Ready!' : 'Ready'}
          </button>
        </div>
      </div>
    </div>
  );
};