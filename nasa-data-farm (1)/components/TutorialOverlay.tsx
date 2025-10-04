import React from 'react';

interface TutorialOverlayProps {
  onStart: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl text-center ring-1 ring-cyan-500 shadow-2xl shadow-cyan-500/20 m-4">
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">🛰️ Welcome to NASA Data Farm!</h2>
        <p className="text-slate-300 text-lg mb-6">Your mission is to build a sustainable farm using real-time satellite data. Make smart decisions to conserve resources and maximize your harvest.</p>
        <div className="text-left space-y-3 text-slate-300 mb-8 bg-slate-900/50 p-6 rounded-lg">
            <p>🕹️ <span className="font-semibold text-cyan-300">Controls:</span> Use <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">A</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">S</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">D</kbd> to move your farmer, and press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">E</kbd> to interact with a tile.</p>
            <p>📊 <span className="font-semibold text-cyan-300">Monitor Data:</span> Check soil moisture, temperature, and more on the side panel.</p>
            <p>🌱 <span className="font-semibold text-cyan-300">Select a Tool:</span> Click a tool on the right, then move to a tile and press E.</p>
            <p>🔬 <span className="font-semibold text-cyan-300">Inspect Your Crops:</span> Use the inspect tool for educational insights on your plants!</p>
        </div>
        <button
          onClick={onStart}
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-full text-xl transition-transform duration-200 hover:scale-105"
        >
          Start Farming
        </button>
      </div>
    </div>
  );
};

export default TutorialOverlay;