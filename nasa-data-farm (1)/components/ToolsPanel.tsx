import React from 'react';
import type { Tool } from '../types';

interface ToolsPanelProps {
  selectedTool: Tool | null;
  onSelect: (tool: Tool) => void;
}

const ToolButton: React.FC<{
  tool: Tool;
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ tool, icon, label, isSelected, onClick }) => {
  const baseClasses = "flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105";
  const selectedClasses = "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300";
  const unselectedClasses = "bg-slate-700 hover:bg-slate-600 text-slate-200";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="font-semibold text-sm mt-1">{label}</span>
    </button>
  );
};

const ToolsPanel: React.FC<ToolsPanelProps> = ({ selectedTool, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <ToolButton tool="plant" icon="🌱" label="Plant" isSelected={selectedTool === 'plant'} onClick={() => onSelect('plant')} />
      <ToolButton tool="water" icon="💧" label="Water" isSelected={selectedTool === 'water'} onClick={() => onSelect('water')} />
      <ToolButton tool="fertilize" icon="🧪" label="Fertilize" isSelected={selectedTool === 'fertilize'} onClick={() => onSelect('fertilize')} />
      <ToolButton tool="harvest" icon="🌾" label="Harvest" isSelected={selectedTool === 'harvest'} onClick={() => onSelect('harvest')} />
      <ToolButton tool="inspect" icon="🔬" label="Inspect" isSelected={selectedTool === 'inspect'} onClick={() => onSelect('inspect')} />
      <ToolButton tool="expand" icon="🚜" label="Expand" isSelected={selectedTool === 'expand'} onClick={() => onSelect('expand')} />
    </div>
  );
};

export default ToolsPanel;
