import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DataErrorProps {
  message: string;
  retry?: () => void;
  className?: string;
}

const DataError: React.FC<DataErrorProps> = ({ 
  message, 
  retry, 
  className = "" 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-red-600 mb-4">
        {message}
      </p>
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
};

export default DataError;