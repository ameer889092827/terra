
import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const unlockedIds = new Set(achievements.map(a => a.id));

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full ring-1 ring-amber-500 shadow-2xl shadow-amber-500/20 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-amber-400">🏆 Achievements</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {Object.entries(ACHIEVEMENTS).map(([id, achData]) => (
            <div key={id} className={`p-4 rounded-lg flex items-center gap-4 transition-opacity ${unlockedIds.has(id) ? 'bg-slate-700 opacity-100' : 'bg-slate-900/50 opacity-50'}`}>
              <div className="text-4xl">{unlockedIds.has(id) ? '✅' : '🔒'}</div>
              <div>
                <h3 className="font-semibold text-lg">{achData.name}</h3>
                <p className="text-sm text-slate-400">{achData.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
