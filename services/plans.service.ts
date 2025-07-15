import axios from 'axios';
import { PlanOffer, Plan } from '@/types/plans.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class PlansService {
  private static instance: PlansService;
  
  public static getInstance(): PlansService {
    if (!PlansService.instance) {
      PlansService.instance = new PlansService();
    }
    return PlansService.instance;
  }

  // Buscar todas as ofertas de planos
  async getPlanOffers(): Promise<PlanOffer[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/offers`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ofertas de planos:', error);
      throw new Error('Falha ao carregar ofertas de planos');
    }
  }

  // Buscar oferta específica por ID
  async getPlanOffer(offerId: string): Promise<PlanOffer> {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/offers/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar oferta de plano:', error);
      throw new Error('Falha ao carregar oferta de plano');
    }
  }

  // Buscar planos ativos
  async getActivePlans(): Promise<Plan[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/active`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos ativos:', error);
      throw new Error('Falha ao carregar planos');
    }
  }

  // Buscar plano do usuário atual
  async getCurrentUserPlan(): Promise<Plan | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/current-plan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar plano atual do usuário:', error);
      return null;
    }
  }

  // Iniciar processo de checkout
  async initiateCheckout(planId: string, billingPeriod: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/plans/checkout`, {
        planId,
        billingPeriod
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.checkoutUrl;
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      throw new Error('Falha ao iniciar processo de pagamento');
    }
  }

  // Mock data para desenvolvimento
  getMockPlans(): Plan[] {
    return [
      {
        id: 'plan-basic',
        name: 'Plano Iniciante',
        description: '50 Créditos/Mês',
        credits: 50,
        bonusCredits: 0,
        price: {
          monthly: 75.00,
          quarterly: 225.00,
          annual: 900.00
        },
        originalPrice: {
          monthly: 150.00,
          quarterly: 450.00,
          annual: 1800.00
        },
        discount: {
          quarterly: 30,
          annual: 20
        },
        features: [
          { id: 'f1', name: 'Cria até 2 Ebook completo', included: true },
          { id: 'f2', name: '0 Créditos Extras de Bônus', included: false },
          { id: 'f3', name: 'Compra de Créditos Extras', included: true },
          { id: 'f4', name: 'Valor do Crédito Extra R$1,00', included: true },
          { id: 'f5', name: 'Geração de Imagens', included: true },
          { id: 'f6', name: 'Geração de textos', included: true },
          { id: 'f7', name: 'Sem limite de capítulos', included: true },
          { id: 'f8', name: 'Criação de Capas Exclusivas', included: true },
          { id: 'f9', name: 'Mais de 10 Tipos de Livros', included: true },
          { id: 'f10', name: 'Mais de 30 Escritores de IA', included: true },
          { id: 'f11', name: 'Vários Idiomas', included: true },
          { id: 'f12', name: 'Revisão de Ebooks com IA', included: true },
          { id: 'f13', name: 'Aprimoramento de Ebooks com IA', included: true },
          { id: 'f14', name: 'Exportação em PDF e Word', included: true },
          { id: 'f15', name: 'Ferramentas de Marketing com IA', included: true },
          { id: 'f16', name: 'Criação de Anúncios', included: true },
          { id: 'f17', name: 'Criação de Posts de Redes Sociais', included: true },
          { id: 'f18', name: 'Copys de Páginas de Vendas', included: true }
        ],
        isPopular: false,
        isRecommended: false,
        checkoutUrl: {
          monthly: '/checkout/plan-basic/monthly',
          quarterly: '/checkout/plan-basic/quarterly',
          annual: '/checkout/plan-basic/annual'
        },
        color: 'blue'
      },
      {
        id: 'plan-pro',
        name: 'Plano Profissional',
        description: '150 Créditos/Mês',
        credits: 150,
        bonusCredits: 10,
        price: {
          monthly: 225.00,
          quarterly: 675.00,
          annual: 2700.00
        },
        originalPrice: {
          monthly: 450.00,
          quarterly: 1350.00,
          annual: 5400.00
        },
        discount: {
          quarterly: 30,
          annual: 20
        },
        features: [
          { id: 'f1', name: 'Cria até 4 Ebooks completos', included: true },
          { id: 'f2', name: '+10 Créditos Extras de Bônus', included: true },
          { id: 'f3', name: 'Compra de Créditos Extras', included: true },
          { id: 'f4', name: 'Valor do Crédito Extra R$0,85', included: true },
          { id: 'f5', name: 'Geração de Imagens', included: true },
          { id: 'f6', name: 'Geração de textos', included: true },
          { id: 'f7', name: 'Sem limite de capítulos', included: true },
          { id: 'f8', name: 'Criação de Capas Exclusivas', included: true },
          { id: 'f9', name: 'Mais de 10 Tipos de Livros', included: true },
          { id: 'f10', name: 'Mais de 30 Escritores de IA', included: true },
          { id: 'f11', name: 'Vários Idiomas', included: true },
          { id: 'f12', name: 'Revisão de Ebooks com IA', included: true },
          { id: 'f13', name: 'Aprimoramento de Ebooks com IA', included: true },
          { id: 'f14', name: 'Exportação em PDF e Word', included: true },
          { id: 'f15', name: 'Ferramentas de Marketing com IA', included: true },
          { id: 'f16', name: 'Criação de Anúncios', included: true },
          { id: 'f17', name: 'Criação de Posts de Redes Sociais', included: true },
          { id: 'f18', name: 'Copys de Páginas de Vendas', included: true }
        ],
        isPopular: true,
        isRecommended: true,
        checkoutUrl: {
          monthly: '/checkout/plan-pro/monthly',
          quarterly: '/checkout/plan-pro/quarterly',
          annual: '/checkout/plan-pro/annual'
        },
        color: 'orange'
      },
      {
        id: 'plan-creator',
        name: 'Plano Criador',
        description: '400 Créditos/Mês',
        credits: 400,
        bonusCredits: 20,
        price: {
          monthly: 525.00,
          quarterly: 1575.00,
          annual: 6300.00
        },
        originalPrice: {
          monthly: 1050.00,
          quarterly: 3150.00,
          annual: 12600.00
        },
        discount: {
          quarterly: 30,
          annual: 20
        },
        features: [
          { id: 'f1', name: 'Cria até 8 Ebooks completos', included: true },
          { id: 'f2', name: '+20 Créditos Extras de Bônus', included: true },
          { id: 'f3', name: 'Compra de Créditos Extras', included: true },
          { id: 'f4', name: 'Valor do Crédito Extra R$0,70', included: true },
          { id: 'f5', name: 'Geração de Imagens', included: true },
          { id: 'f6', name: 'Geração de textos', included: true },
          { id: 'f7', name: 'Sem limite de capítulos', included: true },
          { id: 'f8', name: 'Criação de Capas Exclusivas', included: true },
          { id: 'f9', name: 'Mais de 10 Tipos de Livros', included: true },
          { id: 'f10', name: 'Mais de 30 Escritores de IA', included: true },
          { id: 'f11', name: 'Vários Idiomas', included: true },
          { id: 'f12', name: 'Revisão de Ebooks com IA', included: true },
          { id: 'f13', name: 'Aprimoramento de Ebooks com IA', included: true },
          { id: 'f14', name: 'Exportação em PDF e Word', included: true },
          { id: 'f15', name: 'Ferramentas de Marketing com IA', included: true },
          { id: 'f16', name: 'Criação de Anúncios', included: true },
          { id: 'f17', name: 'Criação de Posts de Redes Sociais', included: true },
          { id: 'f18', name: 'Copys de Páginas de Vendas', included: true }
        ],
        isPopular: false,
        isRecommended: false,
        checkoutUrl: {
          monthly: '/checkout/plan-creator/monthly',
          quarterly: '/checkout/plan-creator/quarterly',
          annual: '/checkout/plan-creator/annual'
        },
        color: 'green'
      }
    ];
  }
}

export const plansService = PlansService.getInstance();
