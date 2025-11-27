export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type LoyaltyBenefit = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type LoyaltyHistoryItem = {
  id: string;
  type: 'order' | 'referral' | 'cashback' | 'bonus';
  title: string;
  points: number;
  date: string;
};

export type ReferralStats = {
  code: string;
  totalReferrals: number;
  pendingRewards: number;
  redeemedRewards: number;
};

export type CashbackWallet = {
  balance: number;
  currency: 'DA';
  upcoming: number;
};

export type LoyaltyState = {
  points: number;
  tier: LoyaltyTier;
  nextTierPoints: number;
  benefits: LoyaltyBenefit[];
  history: LoyaltyHistoryItem[];
  referral: ReferralStats;
  cashback: CashbackWallet;
};

