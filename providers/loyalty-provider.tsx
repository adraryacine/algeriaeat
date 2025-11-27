import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import type { LoyaltyState, LoyaltyHistoryItem, LoyaltyTier } from '@/types/loyalty';

const initialLoyalty: LoyaltyState = {
  points: 1250,
  tier: 'silver',
  nextTierPoints: 2000,
  benefits: [
    { id: 'benefit-1', label: 'Livraison gratuite', description: '1 fois / mois', icon: 'bicycle' },
    { id: 'benefit-2', label: 'Cashback 5%', description: 'Sur restaurants partenaires', icon: 'cash' },
    { id: 'benefit-3', label: 'Support VIP', description: 'Priorité 24/7', icon: 'chatbubbles' },
  ],
  history: [
    { id: 'hist-1', type: 'order', title: 'Commande Le Gourmet', points: 120, date: '23 Nov' },
    { id: 'hist-2', type: 'referral', title: 'Parrainage Samir', points: 300, date: '20 Nov' },
    { id: 'hist-3', type: 'cashback', title: 'Cashback Pizza Palace', points: 80, date: '18 Nov' },
  ],
  referral: {
    code: 'AE-ALG125',
    totalReferrals: 5,
    pendingRewards: 2,
    redeemedRewards: 3,
  },
  cashback: {
    balance: 650,
    currency: 'DA',
    upcoming: 220,
  },
};

type LoyaltyContextValue = {
  loyalty: LoyaltyState;
  addPoints: (points: number, options?: { source?: LoyaltyHistoryItem['type']; title?: string }) => void;
  updateTier: (tier: LoyaltyTier) => void;
};

const LoyaltyContext = createContext<LoyaltyContextValue | undefined>(undefined);

export function LoyaltyProvider({ children }: PropsWithChildren) {
  const [loyalty, setLoyalty] = useState<LoyaltyState>(initialLoyalty);

  const addPoints = (points: number, options?: { source?: LoyaltyHistoryItem['type']; title?: string }) => {
    setLoyalty((prev) => {
      const updatedPoints = prev.points + points;
      const maxTierPoints = prev.nextTierPoints;
      const tierThresholds: Record<LoyaltyTier, number> = { bronze: 0, silver: 1000, gold: 2000, platinum: 4000 };
      let newTier = prev.tier;
      if (updatedPoints >= tierThresholds.platinum) newTier = 'platinum';
      else if (updatedPoints >= tierThresholds.gold) newTier = 'gold';
      else if (updatedPoints >= tierThresholds.silver) newTier = 'silver';
      else newTier = 'bronze';

      const nextTier =
        newTier === 'bronze'
          ? 1000
          : newTier === 'silver'
            ? 2000
            : newTier === 'gold'
              ? 4000
              : prev.nextTierPoints;

      const newHistory: LoyaltyHistoryItem[] = [
        {
          id: `hist-${Date.now()}`,
          type: options?.source ?? 'order',
          title: options?.title ?? 'Commande AlgeriaEat',
          points,
          date: new Date().toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' }),
        },
        ...prev.history,
      ].slice(0, 8);

      return {
        ...prev,
        points: updatedPoints,
        tier: newTier,
        nextTierPoints: nextTier,
        history: newHistory,
        cashback: {
          ...prev.cashback,
          balance: prev.cashback.balance + Math.round(points * 0.05),
        },
      };
    });
  };

  const updateTier = (tier: LoyaltyTier) => {
    setLoyalty((prev) => ({
      ...prev,
      tier,
    }));
  };

  const value = useMemo(
    () => ({
      loyalty,
      addPoints,
      updateTier,
    }),
    [loyalty]
  );

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within LoyaltyProvider');
  }
  return context;
}


