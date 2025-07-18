import { Users } from 'lucide-react';
import { type Player } from '../types';

interface PlayerListProps {
  players: Player[];
  maxPlayers: number;
}

export default function PlayerList({ players, maxPlayers }: PlayerListProps) {
  const getPlayerColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Players ({players.length}/{maxPlayers})</h2>
      </div>
      
      <div className="space-y-4">
        {players.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Waiting for players to join...</p>
          </div>
        ) : (
          players.map((player, index) => (
            <div key={player.deviceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getPlayerColor(index)}`}>
                  {player.playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{player.playerName}</div>
                  <div className="text-sm text-gray-500">
                    {player.status === 'CONNECTED' ? 'Controller Connected' : 'Disconnected'}
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                player.isReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {player.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};