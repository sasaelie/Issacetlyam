import React from 'react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<any>;
  className?: string;
}

export function EmptyState({ 
  title = "Aucune donnée disponible",
  message = "Les informations seront bientôt disponibles. Contactez-nous pour plus de détails.",
  icon: Icon = Package,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
}