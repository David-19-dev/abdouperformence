import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 
  | 'pending' // En attente de confirmation
  | 'confirmed' // Confirmé
  | 'preparing' // En préparation
  | 'shipping' // En cours de livraison
  | 'delivered' // Livré
  | 'cancelled' // Annulé

export interface Order {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    phone: string;
    city: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },
      getOrder: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);