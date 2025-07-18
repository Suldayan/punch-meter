import { Monitor, Smartphone, Zap, Users } from 'lucide-react';

interface MenuScreenProps {
  onHostGame: () => void;
  onJoinGame: () => void;
}

export default function MenuScreen({ onHostGame, onJoinGame }: MenuScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-pink-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-yellow-300/30 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-300/15 rounded-full blur-2xl"></div>
      </div>
      
      {/* Main container with split design */}
      <div className="max-w-5xl w-full relative">
        
        {/* Left side - Host Game */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Character avatar placeholder */}
              <div className="flex justify-center mb-6">
                <div className="bg-white/90 p-6 rounded-full shadow-lg">
                  <Monitor className="w-12 h-12 text-cyan-600" />
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-3xl font-black text-white text-center mb-4 tracking-wide drop-shadow-lg">
                HOST GAME
              </h2>
              
              {/* Subtitle */}
              <p className="text-white/90 text-center mb-6 font-medium">
                Create a room on the big screen
              </p>
              
              {/* Action button */}
              <button
                onClick={onHostGame}
                className="w-full bg-white/90 hover:bg-white text-cyan-600 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-white/50 hover:border-white"
              >
                <Users className="w-6 h-6 inline mr-2" />
                START HOSTING
              </button>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 text-white/40 text-xs">
                85%
              </div>
            </div>
          </div>
          
          {/* Right side - Join Game */}
          <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Character avatar placeholder */}
              <div className="flex justify-center mb-6">
                <div className="bg-white/90 p-6 rounded-full shadow-lg">
                  <Smartphone className="w-12 h-12 text-pink-600" />
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-3xl font-black text-white text-center mb-4 tracking-wide drop-shadow-lg">
                JOIN GAME
              </h2>
              
              {/* Subtitle */}
              <p className="text-white/90 text-center mb-6 font-medium">
                Use your phone as controller
              </p>
              
              {/* Action button */}
              <button
                onClick={onJoinGame}
                className="w-full bg-white/90 hover:bg-white text-pink-600 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-white/50 hover:border-white"
              >
                <Smartphone className="w-6 h-6 inline mr-2" />
                JOIN NOW
              </button>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 text-white/40 text-xs">
                85%
              </div>
            </div>
          </div>
        </div>
        
        {/* Game title header */}
        <div className="text-center mb-8 relative z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 inline-block">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-8 h-8 text-yellow-500 mr-2" />
              <h1 className="text-4xl font-black text-gray-800 tracking-wider">
                PUNCH
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 ml-2">
                  METER
                </span>
              </h1>
            </div>
            <div className="text-sm text-gray-600 font-bold tracking-widest">
              ★ ULTIMATE PARTY GAME ★
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}