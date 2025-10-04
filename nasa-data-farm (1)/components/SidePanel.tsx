import React from 'react';
import type { NasaData, Tool, TerraSuggestion } from '../types';
import DataPanel from './DataPanel';
import ToolsPanel from './ToolsPanel';
import InfoBox from './InfoBox';
import AIHelper from './AIHelper';

interface SidePanelProps {
  nasaData: NasaData;
  selectedTool: Tool | null;
  onToolSelect: (tool: Tool) => void;
  info: { title: string; description: string };
  aiTip: string;
  isAiLoading: boolean;
  onAiRefresh: () => void;
  onAiAnalyze: () => void;
  aiSuggestion: TerraSuggestion | null;
  onApplySuggestion: () => void;
}

const SidePanel: React.FC<SidePanelProps> = (props) => {
  return (
    <aside className="w-96 bg-slate-800/50 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto ring-1 ring-slate-700">
      <AIHelper 
        tip={props.aiTip} 
        isLoading={props.isAiLoading} 
        onRefresh={props.onAiRefresh} 
        onAnalyze={props.onAiAnalyze}
        suggestion={props.aiSuggestion}
        onApplySuggestion={props.onApplySuggestion}
      />
      <DataPanel data={props.nasaData} />
      <ToolsPanel selectedTool={props.selectedTool} onSelect={props.onToolSelect} />
      <InfoBox title={props.info.title} description={props.info.description} />
    </aside>
  );
};

export default SidePanel;
