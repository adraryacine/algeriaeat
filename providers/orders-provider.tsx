import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import type { Order } from '@/types/order';

type OrdersContextValue = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

const initialOrders: Order[] = [
  {
    id: 'ORD-12345',
    restaurant: 'Le Gourmet Algérien',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    items: 3,
    itemsList: ['Couscous Royal x2', "Tajine d'Agneau x1"],
    total: 4050,
    paymentMethod: 'Espèces',
    status: 'En route',
    date: "Aujourd'hui, 14:30",
    statusColor: '#FF6B6B',
    canReorder: true,
    canRate: false,
    canTrack: true,
    estimatedTime: '15 min',
  },
  {
    id: 'ORD-12344',
    restaurant: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    items: 2,
    itemsList: ['Pizza Margherita x1', 'Pizza Pepperoni x1'],
    total: 1800,
    paymentMethod: 'CCP/Baridi Mob',
    status: 'Livré',
    date: 'Hier, 19:45',
    statusColor: '#4ECDC4',
    canReorder: true,
    canRate: true,
    canTrack: false,
    rating: 5,
  },
  {
    id: 'ORD-12343',
    restaurant: 'Burger House',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    items: 1,
    itemsList: ['Burger Deluxe x1'],
    total: 650,
    paymentMethod: 'Paiement à la livraison (COD)',
    status: 'Livré',
    date: '23 Nov, 12:20',
    statusColor: '#4ECDC4',
    canReorder: true,
    canRate: true,
    canTrack: false,
    rating: 4,
  },
];

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: PropsWithChildren) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const value = useMemo(
    () => ({
      orders,
      addOrder,
    }),
    [orders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
}


