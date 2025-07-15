"use client";

import { useState, useEffect } from 'react';
import { Plan, BillingPeriod } from '@/types/plans.types';
import { plansService } from '@/services/plans.service';
import BillingToggle from '@/components/plans/BillingToggle';
import PlanCard from '@/components/plans/PlanCard';
import PlansTable from '@/components/plans/PlansTable';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
    loadCurrentPlan();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      // Para desenvolvimento, usando dados mock
      // Em produção, usar: const plansData = await plansService.getActivePlans();
      const plansData = plansService.getMockPlans();
      setPlans(plansData);
    } catch (err) {
      setError('Erro ao carregar planos');
      console.error('Erro ao carregar planos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentPlan = async () => {
    try {
      const currentPlan = await plansService.getCurrentUserPlan();
      if (currentPlan) {
        setCurrentPlanId(currentPlan.id);
      }
    } catch (err) {
      console.error('Erro ao carregar plano atual:', err);
    }
  };

  const handleSelectPlan = async (plan: Plan, period: BillingPeriod) => {
    try {
      const checkoutUrl = await plansService.initiateCheckout(plan.id, period);
      // Redirecionar para o checkout
      window.open(checkoutUrl, '_blank');
    } catch (err) {
      console.error('Erro ao iniciar checkout:', err);
      // Para desenvolvimento, simular redirecionamento
      alert(`Redirecionando para checkout do ${plan.name} - ${period}`);
    }
  };

  const getDiscounts = () => {
    if (plans.length > 0) {
      return {
        quarterly: plans[0].discount?.quarterly || 30,
        annual: plans[0].discount?.annual || 20
      };
    }
    return { quarterly: 30, annual: 20 };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <span className="material-icons text-6xl">error_outline</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erro ao carregar planos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadPlans}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center mb-6">
          <span className="material-icons text-blue-600 text-4xl mr-3">workspace_premium</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            NeuralBook
          </h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Escolha o Melhor Plano para Você
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Planos flexíveis e econômicos, pensados exclusivamente para você
        </p>
      </div>

      {/* Toggle de Faturamento */}
      <BillingToggle
        currentPeriod={billingPeriod}
        onPeriodChange={setBillingPeriod}
        discounts={getDiscounts()}
      />

      {/* Toggle de Visualização */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${viewMode === 'cards'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="material-icons mr-2 text-sm">view_module</span>
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${viewMode === 'table'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="material-icons mr-2 text-sm">table_chart</span>
            Tabela
          </button>
        </div>
      </div>

      {/* Planos - Cards ou Tabela */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              isCurrentPlan={currentPlanId === plan.id}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      ) : (
        <div className="mb-16">
          <PlansTable
            plans={plans}
            billingPeriod={billingPeriod}
            currentPlanId={currentPlanId}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      )}

      {/* Seção "Por que atualizar?" */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Por que atualizar?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Valorizamos nossos clientes e nosso objetivo é ajudá-los a realizar seus sonhos de todas as maneiras possíveis. 
          Trabalhamos duro para economizar seu tempo e colocá-lo em funcionamento o mais rápido possível. Ao atualizar, 
          você obterá vários recursos novos que podem ajudar a expandir seus negócios.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">speed</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Maior Produtividade</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gere mais conteúdo em menos tempo com recursos avançados
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-green-600 dark:text-green-400 text-2xl">savings</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Economia Garantida</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Melhores preços por crédito e créditos bônus exclusivos
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-purple-600 dark:text-purple-400 text-2xl">auto_awesome</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recursos Exclusivos</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Acesso a funcionalidades premium e ferramentas avançadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
