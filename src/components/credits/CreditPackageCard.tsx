import React from 'react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

interface CreditPackageCardProps {
  package: CreditPackage;
  onPurchase?: (packageId: string) => void;
  className?: string;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({ 
  package: pkg, 
  onPurchase,
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border ${pkg.popular ? 'border-blue-500' : ''} ${className}`}>
      {pkg.popular && (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
          Mais Popular
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {pkg.name}
      </h3>
      
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {pkg.credits.toLocaleString()} créditos
      </div>
      
      <div className="text-xl text-green-600 dark:text-green-400 mb-4">
        R$ {pkg.price.toFixed(2)}
      </div>
      
      <button
        onClick={() => onPurchase?.(pkg.id)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Comprar Agora
      </button>
    </div>
  );
};

export default CreditPackageCard;
