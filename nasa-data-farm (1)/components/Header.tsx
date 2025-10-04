import React from 'react';
import type { GameState } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

interface HeaderProps {
  gameState: GameState;
  onAchievementsClick: () => void;
  onMarketClick: () => void;
  onMapClick: () => void;
}

const Stat: React.FC<{ icon: string; label: string; value: number; unit?: string }> = ({ icon, label, value, unit }) => (
  <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full text-sm">
    <span className="text-xl">{icon}</span>
    <span className="text-slate-300">{label}:</span>
    <span className="font-bold text-white">{value}</span>
    {unit && <span className="text-slate-400">{unit}</span>}
  </div>
);

const XPBar: React.FC<{ level: number, xp: number }> = ({ level, xp }) => {
    const currentLevelXP = LEVEL_THRESHOLDS[level-1];
    const nextLevelXP = LEVEL_THRESHOLDS[level] ?? currentLevelXP;
    const xpIntoLevel = xp - currentLevelXP;
    const xpForLevel = nextLevelXP - currentLevelXP;
    const progress = xpForLevel > 0 ? Math.min(100, (xpIntoLevel / xpForLevel) * 100) : 100;

    return (
        <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-2 rounded-full text-sm w-48">
            <span className="font-bold text-sky-300">Lvl {level}</span>
            <div className="w-full bg-slate-600 rounded-full h-2.5">
                <div className="bg-sky-400 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ gameState, onAchievementsClick, onMarketClick, onMapClick }) => {
  return (
    <header className="bg-slate-800/50 border-b-2 border-slate-700 px-4 py-2 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
        <span className="text-3xl">🛰️</span>
        <span className="hidden lg:inline">NASA Data Farm</span>
      </h1>
      <div className="flex items-center gap-2 md:gap-3">
        <Stat icon="💰" label="$" value={gameState.money} />
        <XPBar level={gameState.level} xp={gameState.xp} />
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full text-sm">
          <span className="text-xl">📅</span>
          <span className="text-slate-300">{gameState.season} - Day {gameState.day}</span>
        </div>
        <button onClick={onMapClick} className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-full transition-transform duration-200 hover:scale-105" title="Regional Map">🗺️</button>
        <button onClick={onMarketClick} className="bg-green-600 hover:bg-green-500 text-white font-bold p-2 rounded-full transition-transform duration-200 hover:scale-105" title="Market & Upgrades">📈</button>
        <button onClick={onAchievementsClick} className="bg-amber-500 hover:bg-amber-400 text-white font-bold p-2 rounded-full transition-transform duration-200 hover:scale-105" title="Achievements">🏆</button>
      </div>
    </header>
  );
};

export default Header;
