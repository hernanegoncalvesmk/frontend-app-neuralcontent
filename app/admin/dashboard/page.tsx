"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AdminMetrics, AdminChartData, AdminActivity } from '@/types/admin.types';
// import { adminService } from '@/services/admin.service'; // Será usado quando backend estiver pronto

// Dynamic import do ApexCharts para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  trend?: number[];
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [userChartData, setUserChartData] = useState<AdminChartData | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<AdminChartData | null>(null);
  const [usageChartData, setUsageChartData] = useState<AdminChartData | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Por enquanto vamos usar dados mock até o backend estar pronto
      const mockMetrics: AdminMetrics = {
        totalUsers: 1247,
        activeUsers: 892,
        monthlyRevenue: 45680.50,
        totalCreditsUsed: 125430,
        totalExtraCreditsUsed: 8940,
        totalProducts: 3420,
        totalPersonas: 1580,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
        creditsGrowth: 15.2,
      };

      const mockUserChart: AdminChartData = {
        categories: ['01 Jul', '02 Jul', '03 Jul', '04 Jul', '05 Jul', '06 Jul', '07 Jul'],
        series: [
          {
            name: 'Novos Usuários',
            data: [15, 23, 18, 32, 28, 19, 25],
            color: '#3B82F6'
          },
          {
            name: 'Usuários Ativos',
            data: [120, 135, 142, 158, 165, 170, 180],
            color: '#10B981'
          }
        ]
      };

      const mockRevenueChart: AdminChartData = {
        categories: ['01 Jul', '02 Jul', '03 Jul', '04 Jul', '05 Jul', '06 Jul', '07 Jul'],
        series: [
          {
            name: 'Receita',
            data: [1200, 1450, 1800, 2100, 1950, 2300, 2180],
            color: '#8B5CF6'
          }
        ]
      };

      const mockUsageChart: AdminChartData = {
        categories: ['Créditos Normais', 'Créditos Extras', 'Produtos', 'Personas'],
        series: [
          {
            name: 'Uso dos Recursos',
            data: [85, 65, 45, 25],
            color: '#F59E0B'
          }
        ]
      };

      const mockActivities: AdminActivity[] = [
        {
          id: '1',
          type: 'user_created',
          title: 'Novo usuário registrado',
          description: 'João Silva se registrou na plataforma',
          user: { id: '1', name: 'João Silva', email: 'joao@email.com' },
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'plan_upgraded',
          title: 'Upgrade de plano',
          description: 'Maria Santos fez upgrade para plano Premium',
          user: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        }
      ];

      setMetrics(mockMetrics);
      setUserChartData(mockUserChart);
      setRevenueChartData(mockRevenueChart);
      setUsageChartData(mockUsageChart);
      setActivities(mockActivities);

      // Quando o backend estiver pronto, descomente:
      // const [metricsData, userChart, revenueChart, usageChart, activitiesData] = await Promise.all([
      //   adminService.getMetrics(),
      //   adminService.getChartData('users', selectedPeriod),
      //   adminService.getChartData('revenue', selectedPeriod),
      //   adminService.getChartData('usage', selectedPeriod),
      //   adminService.getActivities(10)
      // ]);
      
      // setMetrics(metricsData);
      // setUserChartData(userChart);
      // setRevenueChartData(revenueChart);
      // setUsageChartData(usageChart);
      // setActivities(activitiesData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards: MetricCard[] = metrics ? [
    {
      id: 'users',
      title: 'Total de Usuários',
      value: metrics.totalUsers.toLocaleString(),
      subtitle: `${metrics.activeUsers} ativos`,
      change: `+${metrics.userGrowth}% este mês`,
      changeType: 'positive',
      icon: 'group',
      color: 'bg-blue-500',
    },
    {
      id: 'revenue',
      title: 'Receita Mensal',
      value: `R$ ${metrics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: `+${metrics.revenueGrowth}% este mês`,
      changeType: 'positive',
      icon: 'payments',
      color: 'bg-green-500',
    },
    {
      id: 'credits',
      title: 'Créditos Utilizados',
      value: metrics.totalCreditsUsed.toLocaleString(),
      subtitle: `+${metrics.totalExtraCreditsUsed.toLocaleString()} extras`,
      change: `+${metrics.creditsGrowth}% este mês`,
      changeType: 'positive',
      icon: 'account_balance_wallet',
      color: 'bg-purple-500',
    },
    {
      id: 'products',
      title: 'Produtos Gerados',
      value: metrics.totalProducts.toLocaleString(),
      subtitle: `${metrics.totalPersonas} personas criadas`,
      icon: 'inventory_2',
      color: 'bg-orange-500',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema Neural Content
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 3 meses</option>
          </select>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {card.subtitle}
                  </p>
                )}
                {card.change && (
                  <p className={`text-sm mt-1 ${
                    card.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : card.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {card.change}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <i className="material-symbols-outlined text-white text-xl">
                  {card.icon}
                </i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Usuários */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Crescimento de Usuários
          </h3>
          {userChartData && (
            <Chart
              options={{
                chart: { type: 'line', toolbar: { show: false } },
                xaxis: { categories: userChartData.categories },
                stroke: { curve: 'smooth', width: 3 },
                colors: userChartData.series.map(s => s.color),
                theme: { mode: 'light' },
                legend: { position: 'top' }
              }}
              series={userChartData.series}
              type="line"
              height={300}
            />
          )}
        </div>

        {/* Gráfico de Receita */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Receita Diária
          </h3>
          {revenueChartData && (
            <Chart
              options={{
                chart: { type: 'area', toolbar: { show: false } },
                xaxis: { categories: revenueChartData.categories },
                fill: { type: 'gradient' },
                colors: revenueChartData.series.map(s => s.color),
                theme: { mode: 'light' }
              }}
              series={revenueChartData.series}
              type="area"
              height={300}
            />
          )}
        </div>
      </div>

      {/* Gráfico de Uso de Recursos e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Uso de Recursos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uso de Recursos (%)
          </h3>
          {usageChartData && (
            <Chart
              options={{
                chart: { type: 'bar', toolbar: { show: false } },
                xaxis: { categories: usageChartData.categories },
                colors: ['#F59E0B'],
                theme: { mode: 'light' },
                plotOptions: {
                  bar: { borderRadius: 4, horizontal: false }
                }
              }}
              series={usageChartData.series}
              type="bar"
              height={300}
            />
          )}
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <i className="material-symbols-outlined text-primary-600 dark:text-primary-400 text-sm">
                    {activity.type === 'user_created' ? 'person_add' : 
                     activity.type === 'plan_upgraded' ? 'upgrade' :
                     activity.type === 'payment_received' ? 'payment' : 'notification_important'}
                  </i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium">
              Ver todas as atividades →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
