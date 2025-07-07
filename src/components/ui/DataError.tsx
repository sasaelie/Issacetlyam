import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DataErrorProps {
  message?: string;
  retry?: () => void;
  className?: string;
}

export function DataError({ 
  message = "Données indisponibles pour le moment.", 
  retry, 
  className = "" 
}: DataErrorProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-red-600 mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </button>
      )}
    </div>
  );
}