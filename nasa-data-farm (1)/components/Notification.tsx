import React from 'react';
import type { NotificationMessage } from '../types';

const Notification: React.FC<NotificationMessage> = ({ message, type }) => {
  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-400';
      case 'warning': return 'bg-yellow-500 border-yellow-400';
      case 'achievement': return 'bg-amber-500 border-amber-400';
      case 'levelup': return 'bg-sky-500 border-sky-400 font-bold';
      case 'info':
      default:
        return 'bg-cyan-500 border-cyan-400';
    }
  };

  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white border-l-4 animate-slide-in ${getColors()}`}>
      <p>{message}</p>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Notification;
