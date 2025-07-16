"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import do ApexCharts para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardWidget {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  order: number;
  visible: boolean;
}

interface ActivityItem {
  id: string;
  type: 'content' | 'product' | 'persona';
  title: string;
  time: string;
  status: 'success' | 'pending' | 'error';
}

export default function Dashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'credits',
      title: 'Créditos Disponíveis',
      value: '1,250',
      subtitle: 'créditos restantes',
      change: '+150 este mês',
      changeType: 'positive',
      icon: 'account_balance_wallet',
      order: 1,
      visible: true
    },
    {
      id: 'extra-credits',
      title: 'Créditos Extras',
      value: '320',
      subtitle: 'créditos bônus',
      change: '+50 recentes',
      changeType: 'positive',
      icon: 'stars',
      order: 2,
      visible: true
    },
    {
      id: 'plan',
      title: 'Plano Atual',
      value: 'Pro',
      subtitle: 'até 15/02/2025',
      change: '30 dias restantes',
      changeType: 'neutral',
      icon: 'workspace_premium',
      order: 3,
      visible: true
    },
    {
      id: 'usage',
      title: 'Uso Mensal',
      value: '75%',
      subtitle: '750/1000 créditos',
      change: '+12% vs mês anterior',
      changeType: 'positive',
      icon: 'analytics',
      order: 4,
      visible: true
    },
    {
      id: 'products',
      title: 'Produtos',
      value: '24',
      subtitle: 'produtos ativos',
      change: '+3 esta semana',
      changeType: 'positive',
      icon: 'inventory_2',
      order: 5,
      visible: true
    },
    {
      id: 'personas',
      title: 'Personas',
      value: '8',
      subtitle: 'personas criadas',
      change: '+1 recente',
      changeType: 'positive',
      icon: 'people',
      order: 6,
      visible: true
    }
  ]);

  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'content',
      title: 'Post para Instagram criado',
      time: 'há 2 horas',
      status: 'success'
    },
    {
      id: '2',
      type: 'product',
      title: 'Produto "Curso Online" atualizado',
      time: 'há 4 horas',
      status: 'success'
    },
    {
      id: '3',
      type: 'persona',
      title: 'Nova persona "Empreendedor Digital"',
      time: 'há 1 dia',
      status: 'success'
    },
    {
      id: '4',
      type: 'content',
      title: 'E-mail marketing em processamento',
      time: 'há 2 dias',
      status: 'pending'
    }
  ]);

  // Dados para o gráfico de consumo ao longo do tempo
  const [consumptionChartData] = useState({
    series: [{
      name: 'Créditos Utilizados',
      data: [45, 52, 38, 67, 89, 125, 156, 178, 203, 234, 267, 289]
    }],
    options: {
      chart: {
        type: 'line' as const,
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      colors: ['#3b82f6'],
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4
      },
      tooltip: {
        theme: 'light'
      }
    }
  });

  // Dados para o gráfico de distribuição de tipos de conteúdo
  const [contentDistributionData] = useState({
    series: [45, 30, 15, 10],
    options: {
      chart: {
        type: 'pie' as const,
        height: 350
      },
      labels: ['Posts Sociais', 'E-mails', 'Artigos Blog', 'Outros'],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      legend: {
        position: 'bottom' as const,
        labels: {
          colors: '#6b7280'
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    }
  });

  const handleQuickAction = (action: string) => {
    // Aqui você implementaria a navegação para as respectivas páginas
    console.log(`Ação rápida: ${action}`);
  };

  const handlePersonalize = () => {
    // Funcionalidade futura de personalização
    console.log('Personalizando dashboard...');
    // Exemplo: permitir reordenar widgets
    setWidgets(prev => [...prev.reverse()]);
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return 'article';
      case 'product': return 'inventory_2';
      case 'persona': return 'person';
      default: return 'info';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral da sua conta e atividades
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handlePersonalize}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="material-icons mr-2 text-sm">settings</span>
            Personalizar
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
            <span className="material-icons mr-2 text-sm">refresh</span>
            Atualizar
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter(widget => widget.visible)
          .sort((a, b) => a.order - b.order)
          .map((widget) => (
            <div
              key={widget.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-600 dark:text-blue-400 mr-3 text-2xl">
                      {widget.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {widget.title}
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {widget.value}
                        </p>
                        {widget.subtitle && (
                          <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {widget.subtitle}
                          </p>
                        )}
                      </div>
                      {widget.change && (
                        <p className={`text-sm mt-1 ${getChangeColor(widget.changeType || 'neutral')}`}>
                          {widget.change}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => handleQuickAction('create-product')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center">
            <span className="material-icons text-3xl mr-4">add_business</span>
            <div>
              <h3 className="text-lg font-semibold">Criar Produto</h3>
              <p className="text-blue-100">Adicionar novo produto</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleQuickAction('create-persona')}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center">
            <span className="material-icons text-3xl mr-4">person_add</span>
            <div>
              <h3 className="text-lg font-semibold">Criar Persona</h3>
              <p className="text-green-100">Nova persona de cliente</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleQuickAction('create-content')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center">
            <span className="material-icons text-3xl mr-4">auto_awesome</span>
            <div>
              <h3 className="text-lg font-semibold">Gerar Conteúdo</h3>
              <p className="text-purple-100">Criar novo conteúdo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Consumo de Créditos ao Longo do Tempo
          </h3>
          <Chart
            options={consumptionChartData.options}
            series={consumptionChartData.series}
            type="line"
            height={350}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição por Tipo de Conteúdo
          </h3>
          <Chart
            options={contentDistributionData.options}
            series={contentDistributionData.series}
            type="pie"
            height={350}
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Atividades Recentes
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-gray-400 text-xl">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.status)}`}>
                    {activity.status === 'success' && 'Concluído'}
                    {activity.status === 'pending' && 'Pendente'}
                    {activity.status === 'error' && 'Erro'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
