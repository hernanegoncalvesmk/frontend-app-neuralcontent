"use client";

import { Plan, BillingPeriod } from '@/types/plans.types';

interface PlanCardProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isCurrentPlan?: boolean;
  onSelectPlan: (plan: Plan, billingPeriod: BillingPeriod) => void;
}

export default function PlanCard({ 
  plan, 
  billingPeriod, 
  isCurrentPlan, 
  onSelectPlan 
}: PlanCardProps) {
  const getCurrentPrice = () => plan.price[billingPeriod];
  const getOriginalPrice = () => plan.originalPrice?.[billingPeriod];
  const getDiscount = () => {
    if (billingPeriod === 'quarterly') return plan.discount?.quarterly;
    if (billingPeriod === 'annual') return plan.discount?.annual;
    return 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case 'monthly': return '/Mês';
      case 'quarterly': return '/Trimestre';
      case 'annual': return '/Ano';
      default: return '/Mês';
    }
  };

  const getSavingsText = () => {
    if (billingPeriod === 'quarterly') {
      const monthlySavings = (plan.price.monthly * 3) - plan.price.quarterly;
      return `Economize: ${formatPrice(monthlySavings)}`;
    }
    if (billingPeriod === 'annual') {
      const monthlySavings = (plan.price.monthly * 12) - plan.price.annual;
      return `Economize: ${formatPrice(monthlySavings)}`;
    }
    return null;
  };

  const getCardStyle = () => {
    if (plan.isPopular) {
      return 'border-2 border-orange-400 relative transform scale-105 shadow-xl';
    }
    return 'border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600';
  };

  return (
    <div className={`
      relative bg-white dark:bg-gray-800 rounded-xl p-8 transition-all duration-300 hover:shadow-lg
      ${getCardStyle()}
    `}>
      {/* Badge "Mais Popular" */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            Mais Popular
          </span>
        </div>
      )}

      {/* Header do Plano */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
          {plan.description}
        </p>
        
        {/* Preço */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatPrice(getCurrentPrice())}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {getPeriodLabel()}
            </span>
          </div>
          
          {/* Preço original e desconto */}
          {getOriginalPrice() && getDiscount() && (
            <div className="text-center">
              <span className="text-gray-500 line-through text-lg mr-2">
                {formatPrice(getOriginalPrice()!)}
              </span>
              <span className="text-green-600 font-semibold">
                -{getDiscount()}% OFF
              </span>
            </div>
          )}
          
          {/* Texto de economia */}
          {getSavingsText() && (
            <p className="text-green-600 font-medium mt-2">
              {getSavingsText()}
            </p>
          )}
        </div>

        {/* Créditos */}
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{plan.credits}</span> créditos mensais
          </p>
          {plan.bonusCredits > 0 && (
            <p className="text-green-600 font-medium">
              +{plan.bonusCredits} créditos bônus
            </p>
          )}
        </div>
      </div>

      {/* Lista de Features */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature) => (
          <div key={feature.id} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              {feature.included ? (
                <span className="material-icons text-green-500 text-lg">check_circle</span>
              ) : (
                <span className="material-icons text-gray-400 text-lg">cancel</span>
              )}
            </div>
            <span className={`
              ml-3 text-sm
              ${feature.included 
                ? 'text-gray-700 dark:text-gray-300' 
                : 'text-gray-400 dark:text-gray-500 line-through'
              }
            `}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      {/* Botão de Seleção */}
      <button
        onClick={() => onSelectPlan(plan, billingPeriod)}
        disabled={isCurrentPlan}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
          ${isCurrentPlan
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            : plan.isPopular
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }
        `}
      >
        {isCurrentPlan ? 'Plano Atual' : 'Selecionar'}
      </button>
    </div>
  );
}
