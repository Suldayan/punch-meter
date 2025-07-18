import { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface JoinRoomScreenProps {
  onBack: () => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export default function JoinRoomScreen({ onBack, onJoinRoom }: JoinRoomScreenProps) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoinRoom = () => {
    if (roomCode.trim() && playerName.trim()) {
      onJoinRoom(roomCode.trim(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 flex items-center justify-center p-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 max-w-lg w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Room</h2>
          <p className="text-gray-600">Enter the room code from the big screen</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 4-letter code..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg text-center font-mono tracking-widest"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || !playerName.trim()}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};