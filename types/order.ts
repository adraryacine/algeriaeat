export type PaymentMethod =
  | 'ESPÈCES'
  | 'CARTE'
  | 'MOBILE_MONEY'
  | 'CCP_BARIDI'
  | 'COD';

export type OrderStatus = 'En route' | 'Livré' | 'Annulée';

export type Order = {
  id: string;
  restaurant: string;
  image: string;
  items: number;
  itemsList: string[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  date: string;
  statusColor: string;
  canReorder: boolean;
  canRate: boolean;
  canTrack: boolean;
  estimatedTime?: string;
  rating?: number;
};


