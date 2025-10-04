import React from 'react';
import type { TileState, NasaData } from '../types';
import { SOIL_MODIFIERS } from '../constants';

interface TileProps {
  state: TileState;
  isHighlighted: boolean;
  index: number;
  nasaData: NasaData;
}

const Tile: React.FC<TileProps> = ({ state, isHighlighted, index, nasaData }) => {
  if (state.locked) {
    return (
        <div className="relative rounded-md flex items-center justify-center bg-slate-900/70">
             <div className="tile-hittarget absolute inset-[-5px]" data-index={index}></div>
            <span className="text-2xl opacity-30">🔒</span>
            {isHighlighted && <div className="absolute inset-0 ring-2 ring-cyan-400 rounded-md"></div>}
        </div>
    );
  }
  
  const getBackgroundColor = () => {
    let color = SOIL_MODIFIERS[state.soilType].color;
    if (state.planted) color = 'bg-yellow-900/80';
    if (state.watered) color += ' bg-blue-500/20';
    if (state.fertilized) color += ' bg-green-500/10';
    return color;
  };

  const getBorderColor = () => {
    if (isHighlighted) return 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-yellow-900/50';
    if (state.growth >= 4) return 'ring-2 ring-amber-400 animate-pulse';
    return 'ring-1 ring-black/20';
  };

  const growthClasses = [
    '', // stage 0 - not used here
    'opacity-40 scale-50', // stage 1
    'opacity-60 scale-75', // stage 2
    'opacity-80 scale-90', // stage 3
    'opacity-100 scale-100', // stage 4
  ];
  
  const growthStage = state.growth > 0 ? Math.min(4, Math.ceil(state.growth)) : 0;
  const isWindy = state.planted && nasaData.windSpeed > 15;

  return (
    <div
      className={`relative rounded-md flex items-center justify-center transition-all duration-200 ease-in-out ${getBackgroundColor()} ${getBorderColor()}`}
      title={`Soil: ${state.soilType.charAt(0).toUpperCase() + state.soilType.slice(1)}`}
    >
      {/* This invisible div is a larger hittarget for calculating player proximity */}
      <div className="tile-hittarget absolute inset-[-5px]" data-index={index}></div>

      {state.planted && state.crop && growthStage > 0 && (
        <div className={`w-full h-full flex items-center justify-center ${isWindy ? 'animate-wind-sway' : ''}`}>
            <span className={`text-4xl transition-transform duration-500 select-none ${growthClasses[growthStage]}`}>
                {state.crop.icon}
            </span>
        </div>
      )}
    </div>
  );
};

export default Tile;
