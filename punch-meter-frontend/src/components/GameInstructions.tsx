import { Gamepad2 } from 'lucide-react';

interface GameInstructionsProps {
  onStartGame: () => void;
  canStartGame: boolean;
}

export default function GameInstructions({ onStartGame, canStartGame }: GameInstructionsProps) {
    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
            <Gamepad2 className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Game Controls</h2>
            </div>
            
            <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <h3 className="font-bold text-gray-800 mb-3">How to Play</h3>
                <ul className="space-y-2 text-gray-600">
                <li>• Use your phone as a controller</li>
                <li>• Swing to punch the bag</li>
                <li>• Get the highest score to win</li>
                <li>• Each player gets 3 attempts</li>
                </ul>
            </div>
            
            <button
                onClick={onStartGame}
                disabled={!canStartGame}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {canStartGame ? 'Start Game' : 'Waiting for Players'}
            </button>
            </div>
        </div>
)};