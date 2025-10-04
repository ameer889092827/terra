
import React from 'react';

interface InfoBoxProps {
  title: string;
  description: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, description }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-lg flex-1 ring-1 ring-slate-700">
      <h4 className="text-md font-bold text-amber-300">{title}</h4>
      <p className="text-sm text-slate-300 mt-2">{description}</p>
    </div>
  );
};

export default InfoBox;
