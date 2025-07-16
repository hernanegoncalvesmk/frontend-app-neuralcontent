# Componentes de Créditos - NeuralContent

Este diretório contém todos os componentes relacionados ao sistema de gerenciamento de créditos do NeuralContent.

## 📁 Estrutura

```
components/credits/
├── CreditAlerts.tsx          # Sistema de alertas inteligente
├── CreditBalanceCard.tsx     # Card de saldo atual
├── CreditHistoryTable.tsx    # Tabela de histórico de transações
├── CreditPackageCard.tsx     # Card de pacotes para compra
├── index.ts                  # Exportações centralizadas
└── README.md                # Esta documentação
```

## 🧩 Componentes

### CreditBalanceCard
Card principal que exibe o saldo atual de créditos com indicadores visuais e ações rápidas.

**Props:**
- `balance: CreditBalance | null` - Dados do saldo
- `loading?: boolean` - Estado de carregamento
- `onPurchase?: () => void` - Callback para compra
- `onViewHistory?: () => void` - Callback para histórico
- `className?: string` - Classes CSS adicionais

**Características:**
- ✅ Indicadores de saldo baixo
- ✅ Alertas de expiração
- ✅ Design responsivo
- ✅ Estados de loading
- ✅ Ações rápidas

### CreditPackageCard
Card para exibir pacotes de créditos disponíveis para compra.

**Props:**
- `package: CreditPackage` - Dados do pacote
- `loading?: boolean` - Estado de carregamento
- `onPurchase: (packageId: string) => void` - Callback de compra
- `className?: string` - Classes CSS adicionais

**Características:**
- ✅ Badge "Mais Popular"
- ✅ Cálculo de descontos
- ✅ Lista de recursos inclusos
- ✅ Indicadores de validade
- ✅ Design responsivo

### CreditHistoryTable
Tabela responsiva para exibir o histórico de transações.

**Props:**
- `transactions: CreditTransaction[]` - Lista de transações
- `loading?: boolean` - Estado de carregamento
- `pagination?` - Dados de paginação
- `onPageChange: (page: number) => void` - Callback de mudança de página
- `onFilterChange: (filters: CreditHistoryFilters) => void` - Callback de filtros
- `className?: string` - Classes CSS adicionais

**Características:**
- ✅ Filtros por tipo e status
- ✅ Paginação inteligente
- ✅ Layout responsivo (desktop/mobile)
- ✅ Detalhes expandíveis
- ✅ Estados de loading

### CreditAlerts
Sistema inteligente de alertas baseado no estado dos créditos.

**Props:**
- `balance: CreditBalance` - Saldo atual
- `lastUsage?` - Dados do último uso
- `onPurchaseCredits?: () => void` - Callback para compra
- `onDismissAlert?: (alertId: string) => void` - Callback de dismissal
- `className?: string` - Classes CSS adicionais

**Tipos de Alertas:**
- 🔴 **Crítico**: Saldo muito baixo (≤20 créditos)
- 🟡 **Aviso**: Saldo baixo (≤100 créditos)
- 🟡 **Expiração**: Créditos expirando em breve
- 🔵 **Info**: Sugestões e dicas
- 🟢 **Sucesso**: Confirmações de compra

## 🎨 Design System

Todos os componentes seguem os padrões do **Trezo Theme v3.6.0**:

- **Cores**: Paleta azul como primária
- **Tipografia**: Hierarquia consistente
- **Espaçamento**: Sistema de grid 8px
- **Responsividade**: Mobile-first
- **Acessibilidade**: WCAG 2.1 AA

## 📱 Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| `sm` (640px+) | Layout mobile otimizado |
| `md` (768px+) | Transição para desktop |
| `lg` (1024px+) | Layout desktop completo |
| `xl` (1280px+) | Layout expandido |

## 🚀 Uso

### Importação Simples
```tsx
import {
  CreditBalanceCard,
  CreditPackageCard,
  CreditHistoryTable,
  CreditAlerts
} from '@/components/credits';
```

### Exemplo Completo
```tsx
'use client';

import { useCredits } from '@/hooks/useCredits';
import { CreditBalanceCard, CreditAlerts } from '@/components/credits';

export default function CreditsPage() {
  const { state, actions } = useCredits();

  return (
    <div className="space-y-8">
      <CreditAlerts
        balance={state.balance}
        onPurchaseCredits={() => {/* lógica de compra */}}
      />
      
      <CreditBalanceCard
        balance={state.balance}
        loading={state.loading.balance}
        onPurchase={() => {/* lógica de compra */}}
      />
    </div>
  );
}
```

## 🔧 Dependências

- **React 19**: Hooks e componentes
- **TypeScript 5**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Material Icons**: Ícones
- **@/hooks/useCredits**: Hook de estado
- **@/services/credits.service**: Serviços de API
- **@/types/credits.types**: Definições de tipos

## 🎯 Funcionalidades

### Estados de Loading
Todos os componentes suportam estados de loading com skeletons animados.

### Tratamento de Erros
Fallbacks visuais para estados de erro com opções de retry.

### Acessibilidade
- Screen reader friendly
- Navegação por teclado
- Cores com contraste adequado
- Aria labels descritivos

### Performance
- Lazy loading de dados
- Memoização de cálculos
- Otimização de re-renders
- Debounce em filtros

## 📋 Checklist de Implementação

- [x] ✅ Componente de saldo
- [x] ✅ Componente de pacotes
- [x] ✅ Tabela de histórico
- [x] ✅ Sistema de alertas
- [x] ✅ Página principal integrada
- [x] ✅ Responsividade mobile
- [x] ✅ Estados de loading
- [x] ✅ Tratamento de erros
- [x] ✅ Documentação completa

## 🛠️ Manutenção

Para adicionar novos componentes:

1. Crie o arquivo `.tsx` no diretório
2. Siga os padrões de nomenclatura
3. Adicione a exportação no `index.ts`
4. Documente neste README
5. Adicione testes unitários

## 📝 Notas de Desenvolvimento

- **Padrão de Props**: Sempre incluir `className` opcional
- **Loading States**: Usar skeletons consistentes
- **Error Boundaries**: Implementar fallbacks gracefulls
- **Performance**: Memoizar componentes pesados
- **Acessibilidade**: Testar com screen readers
