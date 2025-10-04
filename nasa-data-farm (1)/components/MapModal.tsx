import React, { useState } from 'react';

interface MapModalProps {
  onClose: () => void;
}

type DataOverlay = 'none' | 'temp' | 'moisture' | 'ndvi';

const MapModal: React.FC<MapModalProps> = ({ onClose }) => {
    const [overlay, setOverlay] = useState<DataOverlay>('none');

    const getOverlayColor = (value: number, type: DataOverlay): string => {
        if (type === 'none') return 'bg-transparent';
        
        let hue;
        // Simple linear interpolation for color
        if (type === 'temp') { // Blue (cold) to Red (hot)
            hue = 240 - (value * 2.4); // 0-100 -> 240-0
        } else if (type === 'moisture') { // Yellow (dry) to Blue (wet)
            hue = 60 + (value * 1.8); // 0-100 -> 60-240
        } else { // NDVI: Red (low) to Green (high)
            hue = value * 1.2; // 0-100 -> 0-120
        }
        return `hsl(${hue}, 80%, 50%, 0.5)`;
    };
    
    const renderGrid = () => {
        return Array.from({ length: 15 * 10 }).map((_, i) => {
            const isPlayerPlot = i > 65 && i < 70 && i % 15 > 5 && i % 15 < 10;
            const isAvailable = i > 40 && i < 100 && Math.random() > 0.7;

            let baseClass = "border border-slate-700/50";
            if (isPlayerPlot) baseClass = "border-2 border-cyan-400 bg-cyan-500/20";
            else if (isAvailable) baseClass = "border border-green-500/50 bg-green-900/20 cursor-pointer hover:bg-green-500/30";

            const randomValue = Math.random() * 100;

            return <div key={i} className={baseClass} style={{ backgroundColor: overlay !== 'none' ? getOverlayColor(randomValue, overlay) : undefined }} />;
        });
    };

    const getButtonClass = (type: DataOverlay) => {
        return `px-4 py-2 rounded-md font-semibold transition ${overlay === type ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`;
    };

    return (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full ring-1 ring-blue-500 shadow-2xl shadow-blue-500/20 m-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-blue-400">🗺️ Regional Map</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="grid grid-cols-15 grid-rows-10 w-full h-96 bg-slate-900/50 p-2 rounded-lg">
                    {renderGrid()}
                </div>
                
                <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-300">Data Overlays:</span>
                        <button className={getButtonClass('none')} onClick={() => setOverlay('none')}>None</button>
                        <button className={getButtonClass('temp')} onClick={() => setOverlay('temp')}>Temperature</button>
                        <button className={getButtonClass('moisture')} onClick={() => setOverlay('moisture')}>Soil Moisture</button>
                        <button className={getButtonClass('ndvi')} onClick={() => setOverlay('ndvi')}>NDVI</button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-cyan-400"></div><span>Your Farm</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 border border-green-500/50 bg-green-900/20"></div><span>Available Plot</span></div>
                    </div>
                </div>

            </div>
            <style>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); } .grid-rows-10 { grid-template-rows: repeat(10, minmax(0, 1fr)); }`}</style>
        </div>
    );
};

export default MapModal;
