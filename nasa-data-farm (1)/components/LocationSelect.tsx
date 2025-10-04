import React from 'react';
import { Location } from '../types';
import { LOCATIONS } from '../data/locations';

interface LocationSelectProps {
  onSelect: (location: Location) => void;
}

const LocationCard: React.FC<{ location: Location, onSelect: () => void }> = ({ location, onSelect }) => (
    <div className="bg-slate-800 rounded-lg p-6 ring-1 ring-slate-700 hover:ring-cyan-400 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col">
        <h3 className="text-2xl font-bold text-cyan-400">{location.name}</h3>
        <p className="text-slate-400 mt-2 flex-1">{location.description}</p>
        <button
            onClick={onSelect}
            className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition"
        >
            Start Farming Here
        </button>
    </div>
);

const LocationSelect: React.FC<LocationSelectProps> = ({ onSelect }) => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans antialiased">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-cyan-400 flex items-center gap-4">
                <span className="text-6xl">🛰️</span>
                <span>NASA Data Farm</span>
            </h1>
            <p className="text-slate-300 text-xl mt-4">Choose your farming location to begin your sustainable agriculture journey.</p>
        </div>
        <div className="max-w-4xl w-full grid md:grid-cols-3 gap-6">
            {LOCATIONS.map(loc => (
                <LocationCard key={loc.id} location={loc} onSelect={() => onSelect(loc)} />
            ))}
        </div>
        <footer className="text-slate-500 mt-12 text-sm">
            Data simulated based on NASA's Earth observation programs.
        </footer>
    </div>
  );
};

export default LocationSelect;
