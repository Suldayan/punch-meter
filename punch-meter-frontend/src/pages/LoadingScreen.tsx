import { useState, useEffect } from 'react';

export default function WiiLoadingScreen() {
  const [loadingText, setLoadingText] = useState('Loading');
  const [score, setScore] = useState(0);
  const [isPunching, setIsPunching] = useState(false);
  const [floatingScore, setFloatingScore] = useState(null);
  const [orbPositions, setOrbPositions] = useState([]);

  useEffect(() => {
    // Initialize floating orbs
    const initialOrbs = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }));
    setOrbPositions(initialOrbs);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 600);

    const punchInterval = setInterval(() => {
      setIsPunching(true);
      const newScore = Math.floor(Math.random() * 50) + 50;
      setScore(prev => Math.min(prev + newScore, 999));
      setFloatingScore(newScore);
      
      setTimeout(() => {
        setIsPunching(false);
        setFloatingScore(null);
      }, 800);
    }, 2000);

    return () => {
      clearInterval(textInterval);
      clearInterval(punchInterval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 relative overflow-hidden">
      {/* Geometric Gradient Background Patterns */}
      <div className="absolute inset-0">
        {/* Large Angular Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300 opacity-40 transform rotate-12 -translate-x-32 -translate-y-32 blur-sm"></div>
        <div className="absolute top-32 right-0 w-80 h-80 bg-gradient-to-bl from-pink-200 via-orange-200 to-yellow-200 opacity-40 transform -rotate-12 translate-x-20 -translate-y-20 blur-sm"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-green-200 via-teal-200 to-cyan-200 opacity-40 transform rotate-45 translate-y-20 blur-sm"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-tl from-purple-200 via-pink-200 to-red-200 opacity-40 transform -rotate-45 translate-y-10 blur-sm"></div>
        
        {/* Medium Angular Overlays */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-blue-300 to-indigo-300 opacity-30 transform rotate-30 blur-sm"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-gradient-to-bl from-orange-300 to-red-300 opacity-30 transform -rotate-30 blur-sm"></div>
        <div className="absolute bottom-1/3 left-1/2 w-56 h-56 bg-gradient-to-tr from-teal-300 to-blue-300 opacity-30 transform rotate-60 blur-sm"></div>
        
        {/* Small Accent Shapes */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-300 opacity-25 transform rotate-15 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-bl from-pink-300 to-purple-300 opacity-25 transform -rotate-15 blur-sm"></div>
      </div>

      {/* Floating Orbs Background */}
      <div className="absolute inset-0">
        {orbPositions.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-15 animate-pulse"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-blue-200" />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Game Title */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 tracking-tight">
            PUNCH
          </h1>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-6 tracking-tight">
            POWER
          </h2>
          <div className="text-2xl text-gray-600 font-bold">
            Nintendo Switch Sports
          </div>
        </div>

        {/* Central Game Area */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-gray-100 relative">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="text-gray-500 text-lg font-bold mb-2">HIGH SCORE</div>
              <div className="text-6xl font-black text-gray-800 font-mono tracking-wider">
                {score.toString().padStart(3, '0')}
              </div>
            </div>

            {/* Punching Bag */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Chain */}
                <div className="w-1 h-12 bg-gray-400 mx-auto mb-2"></div>
                
                {/* Bag */}
                <div className={`relative transition-all duration-500 ${isPunching ? 'transform rotate-12 scale-110' : ''}`}>
                  <div className="w-20 h-32 bg-gradient-to-b from-red-400 to-red-600 rounded-full border-4 border-red-300 shadow-lg">
                    {/* Bag Details */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                    <div className="absolute top-12 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                    <div className="absolute top-16 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                    <div className="absolute top-20 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                    <div className="absolute top-24 left-0 right-0 h-0.5 bg-red-700 opacity-60"></div>
                  </div>
                  
                  {/* Impact Effect */}
                  {isPunching && (
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                      <div className="w-16 h-16 bg-yellow-300 rounded-full animate-ping opacity-80"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Score */}
            {floatingScore && (
              <div className="absolute top-4 right-4 animate-bounce">
                <div className="text-3xl font-bold text-orange-500">
                  +{floatingScore}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s',
                }}
              />
            ))}
          </div>
          <div className="text-2xl font-bold text-gray-700">
            {loadingText}
          </div>
        </div>

        {/* Rotating Elements */}
        <div className="flex justify-center space-x-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-spin shadow-lg" style={{ animationDuration: '3s' }}>
            <div className="w-4 h-4 bg-white rounded-full mt-2 ml-2"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-spin shadow-lg" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="w-3 h-3 bg-white rounded-full mt-1.5 ml-1.5"></div>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-spin shadow-lg" style={{ animationDuration: '4s' }}>
            <div className="w-5 h-5 bg-white rounded-full mt-2.5 ml-2.5"></div>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-8 right-8 w-8 h-8 bg-gradient-to-br from-pink-300 to-red-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-8 left-8 w-10 h-10 bg-gradient-to-br from-green-300 to-blue-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}