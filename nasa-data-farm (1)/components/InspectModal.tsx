import React from 'react';
import { TileState, NasaData } from '../types';
import { SOIL_MODIFIERS } from '../constants';

interface InspectModalProps {
  tile: TileState | null;
  nasaData: NasaData;
  onClose: () => void;
}

const DataRow: React.FC<{ label: string, value: React.ReactNode, educationalNote: string }> = ({ label, value, educationalNote }) => (
    <div className="py-3 border-b border-slate-700">
        <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-300">{label}</span>
            <span className="font-bold text-cyan-300 text-lg">{value}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 italic">💡 {educationalNote}</p>
    </div>
);

const InspectModal: React.FC<InspectModalProps> = ({ tile, nasaData, onClose }) => {
  if (!tile || !tile.crop) return null;

  const isTempOptimal = nasaData.temperature >= tile.crop.optimalTemp[0] && nasaData.temperature <= tile.crop.optimalTemp[1];
  const isMoistureOptimal = nasaData.soilMoisture >= 50 && nasaData.soilMoisture <= 75;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full ring-1 ring-cyan-500 shadow-2xl shadow-cyan-500/20 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
            <span className="text-4xl">{tile.crop.icon}</span>
            <span>{tile.crop.name} Analysis</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="space-y-2 bg-slate-900/50 p-4 rounded-lg">
            <DataRow 
                label="Soil Type"
                value={<span style={{ textTransform: 'capitalize' }}>{tile.soilType}</span>}
                educationalNote={`'${tile.soilType}' soil affects water retention and yield. Clay holds water well, while sandy soil drains quickly.`}
            />
            <DataRow 
                label="Growth Stage"
                value={`${tile.growth.toFixed(1)} / 4`}
                educationalNote={`NDVI of ${nasaData.ndvi.toFixed(2)} indicates vegetation health. Healthy plants reflect more infrared light, which satellites can see.`}
            />
            <DataRow 
                label="Current Temperature"
                value={<span className={isTempOptimal ? 'text-green-400' : 'text-red-400'}>{nasaData.temperature.toFixed(0)}°C</span>}
                educationalNote={`Optimal for ${tile.crop.name}: ${tile.crop.optimalTemp[0]}-${tile.crop.optimalTemp[1]}°C. Satellites monitor land surface temperature to predict heat stress on crops.`}
            />
            <DataRow 
                label="Soil Moisture"
                value={<span className={isMoistureOptimal ? 'text-green-400' : 'text-yellow-400'}>{nasaData.soilMoisture.toFixed(0)}%</span>}
                educationalNote={`NASA's SMAP mission measures soil moisture from orbit. This is crucial for predicting droughts.`}
            />
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition">Close</button>
      </div>
    </div>
  );
};

export default InspectModal;
