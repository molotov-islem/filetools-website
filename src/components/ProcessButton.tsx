import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  disabled: boolean;
  label: string;
}

export function ProcessButton({ onClick, isProcessing, disabled, label }: ProcessButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`
          px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200
          ${disabled || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }
        `}
      >
        <div className="flex items-center space-x-2">
          {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
          <span>{isProcessing ? 'Processing...' : label}</span>
        </div>
      </button>
    </div>
  );
}