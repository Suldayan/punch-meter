import { useState } from 'react';
import { Monitor } from 'lucide-react';

interface CreateRoomScreenProps {
  onBack: () => void;
  onCreateRoom: (roomName: string) => void;
}

export default function CreateRoomScreen({ onBack, onCreateRoom }: CreateRoomScreenProps) {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      onCreateRoom(roomName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 max-w-lg w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Room</h2>
          <p className="text-gray-600">Set up your party game</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
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
              onClick={handleCreateRoom}
              disabled={!roomName.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};