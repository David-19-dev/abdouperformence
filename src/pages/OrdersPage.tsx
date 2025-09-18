import React from 'react';
import OrderHistory from '../components/OrderHistory';

const OrdersPage: React.FC = () => {
  return (
    <main className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>
        <OrderHistory />
      </div>
    </main>
  );
};

export default OrdersPage;