// Types para o sistema de planos
export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  highlight?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  credits: number;
  bonusCredits: number;
  price: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  originalPrice?: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  discount?: {
    quarterly: number; // percentual
    annual: number; // percentual
  };
  features: PlanFeature[];
  isPopular: boolean;
  isRecommended: boolean;
  checkoutUrl: {
    monthly: string;
    quarterly: string;
    annual: string;
  };
  color?: string; // cor do tema para o card
}

export interface PlanOffer {
  id: string;
  name: string;
  description: string;
  plans: Plan[];
  isActive: boolean;
  validUntil?: Date;
}

export type BillingPeriod = 'monthly' | 'quarterly' | 'annual';

export interface PlanComparison {
  featureName: string;
  description?: string;
  plans: {
    [planId: string]: boolean | string | number;
  };
}

// Types para componentes da UI
export interface PlanCardProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isCurrentPlan?: boolean;
  onSelectPlan: (plan: Plan, billingPeriod: BillingPeriod) => void;
}

export interface PlansTableProps {
  plans: Plan[];
  billingPeriod: BillingPeriod;
  currentPlanId?: string;
  onSelectPlan: (plan: Plan, billingPeriod: BillingPeriod) => void;
}

export interface BillingToggleProps {
  currentPeriod: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
  discounts: {
    quarterly: number;
    annual: number;
  };
}
