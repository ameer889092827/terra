import React from 'react';
import Tile from './Tile';
import type { TileState, NasaData } from '../types';

interface FarmGridProps {
  tiles: TileState[];
  highlightedTileIndex: number | null;
  nasaData: NasaData;
}

const FarmGrid: React.FC<FarmGridProps> = ({ tiles, highlightedTileIndex, nasaData }) => {
  return (
    <div className="grid grid-cols-12 grid-rows-8 gap-2 bg-yellow-900/50 p-2 rounded-lg h-full relative">
      {tiles.map((tile, index) => (
        <Tile 
          key={index} 
          state={tile} 
          isHighlighted={index === highlightedTileIndex} 
          index={index}
          nasaData={nasaData}
        />
      ))}
    </div>
  );
};

export default FarmGrid;