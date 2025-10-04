import React from 'react';
import { FarmerState } from '../types';

interface FarmerProps {
  position: { x: number; y: number };
  direction: 'down' | 'up' | 'left' | 'right';
}

const Farmer: React.FC<FarmerProps> = ({ position, direction }) => {
  const getDirectionClasses = () => {
    if (direction === 'left') {
        return 'transform scale-x-[-1]';
    }
    return '';
  };

  return (
    <div
      className="absolute w-8 h-12 transition-transform duration-100"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        willChange: 'transform, top, left',
      }}
    >
      <div className={`relative w-full h-full flex items-center justify-center ${getDirectionClasses()}`}>
        <div className="text-5xl select-none">👨‍🌾</div>
      </div>
    </div>
  );
};

export default Farmer;