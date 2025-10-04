import React from 'react';
import { GameState, Upgrade } from '../types';
import { UPGRADES } from '../constants';

interface MarketModalProps {
  gameState: GameState;
  onClose: () => void;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
}

const UpgradeCard: React.FC<{ upgrade: Upgrade, gameState: GameState, onBuy: () => void }> = ({ upgrade, gameState, onBuy }) => {
    const canAfford = gameState.money >= upgrade.cost;
    const isUnlocked = gameState.level >= upgrade.levelRequired;
    const isPurchased = !!gameState.upgrades[upgrade.id];

    let button;
    if (isPurchased) {
        button = <button disabled className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-md cursor-default">Purchased</button>;
    } else if (!isUnlocked) {
        button = <button disabled className="w-full bg-slate-600 text-slate-400 font-bold py-2 px-4 rounded-md cursor-not-allowed">Lvl {upgrade.levelRequired} Req.</button>;
    } else {
        button = <button onClick={onBuy} disabled={!canAfford} className={`w-full font-bold py-2 px-4 rounded-md transition ${canAfford ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
            Buy for ${upgrade.cost}
        </button>;
    }

    return (
        <div className={`p-4 rounded-lg flex flex-col gap-2 transition-opacity ${isUnlocked ? 'bg-slate-700' : 'bg-slate-900/50 opacity-60'}`}>
            <div>
                <h3 className="font-semibold text-lg text-cyan-300">{upgrade.name}</h3>
                <p className="text-sm text-slate-300 flex-1">{upgrade.description}</p>
            </div>
            {button}
        </div>
    );
};

const MarketModal: React.FC<MarketModalProps> = ({ gameState, onClose, onBuyUpgrade }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full ring-1 ring-green-500 shadow-2xl shadow-green-500/20 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-400">📈 Market & Upgrades</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-600 pb-2">Permanent Upgrades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(UPGRADES).map(upgrade => (
                    <UpgradeCard 
                        key={upgrade.id}
                        upgrade={upgrade}
                        gameState={gameState}
                        onBuy={() => onBuyUpgrade(upgrade.id, upgrade.cost)}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarketModal;
