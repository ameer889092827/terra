import React from 'react';
import type { NasaData } from '../types';

interface DataPanelProps {
  data: NasaData;
}

const DataItem: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
  <div className="flex justify-between items-center text-sm py-2 px-3 bg-slate-700/30 rounded-md">
    <span className="text-slate-300">{label}</span>
    <span className="font-bold text-cyan-300">{value} <span className="text-slate-400 font-normal">{unit}</span></span>
  </div>
);

const DataPanel: React.FC<DataPanelProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-lg space-y-2 ring-1 ring-slate-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2 text-center">🛰️ Satellite Data</h3>
      <DataItem label="Temperature" value={data.temperature.toFixed(0)} unit="°C" />
      <DataItem label="Soil Moisture" value={data.soilMoisture.toFixed(0)} unit="%" />
      <DataItem label="Rel. Humidity" value={data.relativeHumidity.toFixed(0)} unit="%" />
      <DataItem label="Precipitation" value={data.precipitation.toFixed(1)} unit="mm" />
      <DataItem label="Solar Irradiance" value={data.solarIrradiance.toFixed(0)} unit="W/m²" />
      <DataItem label="NDVI" value={data.ndvi.toFixed(2)} unit="" />
    </div>
  );
};

export default DataPanel;
