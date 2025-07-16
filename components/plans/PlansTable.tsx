"use client";

import { Plan, BillingPeriod } from '@/types/plans.types';

interface PlansTableProps {
  plans: Plan[];
  billingPeriod: BillingPeriod;
  currentPlanId?: string;
  onSelectPlan: (plan: Plan, billingPeriod: BillingPeriod) => void;
}

export default function PlansTable({ 
  plans, 
  billingPeriod, 
  currentPlanId, 
  onSelectPlan 
}: PlansTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'annual': return 'Anual';
      default: return 'Mensal';
    }
  };

  // Obter todas as features únicas
  const allFeatures = Array.from(
    new Set(plans.flatMap(plan => plan.features.map(f => f.name)))
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header da Tabela */}
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Recursos / Planos
                </span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} className="px-6 py-4 text-center">
                  <div className="space-y-2">
                    {/* Badge Popular */}
                    {plan.isPopular && (
                      <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Mais Popular
                      </span>
                    )}
                    
                    {/* Nome do Plano */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    
                    {/* Descrição */}
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {plan.description}
                    </p>
                    
                    {/* Preço */}
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(plan.price[billingPeriod])}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {getPeriodLabel()}
                      </div>
                      
                      {/* Desconto */}
                      {plan.originalPrice?.[billingPeriod] && plan.discount && (
                        <div className="text-sm">
                          <span className="text-gray-500 line-through mr-2">
                            {formatPrice(plan.originalPrice[billingPeriod])}
                          </span>
                          <span className="text-green-600 font-semibold">
                            -{billingPeriod === 'quarterly' ? plan.discount.quarterly : plan.discount.annual}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Botão de Seleção */}
                    <button
                      onClick={() => onSelectPlan(plan, billingPeriod)}
                      disabled={currentPlanId === plan.id}
                      className={`
                        w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                        ${currentPlanId === plan.id
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : plan.isPopular
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }
                      `}
                    >
                      {currentPlanId === plan.id ? 'Plano Atual' : 'Selecionar'}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body da Tabela */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Linha de Créditos */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                Créditos Mensais
              </td>
              {plans.map((plan) => (
                <td key={plan.id} className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.credits}
                  </span>
                  {plan.bonusCredits > 0 && (
                    <div className="text-green-600 font-medium text-sm">
                      +{plan.bonusCredits} bônus
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Recursos */}
            {allFeatures.map((featureName, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {featureName}
                </td>
                {plans.map((plan) => {
                  const feature = plan.features.find(f => f.name === featureName);
                  return (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {feature ? (
                        feature.included ? (
                          <span className="material-icons text-green-500">check_circle</span>
                        ) : (
                          <span className="material-icons text-gray-400">cancel</span>
                        )
                      ) : (
                        <span className="material-icons text-gray-400">cancel</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}