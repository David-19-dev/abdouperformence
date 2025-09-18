import React from 'react';
import { Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { OrderStatus } from '../store/orders';

interface OrderTrackerProps {
  status: OrderStatus;
  updatedAt: string;
  estimatedDelivery?: string;
}

const statusSteps = [
  { status: 'confirmed', label: 'Confirmé', icon: CheckCircle },
  { status: 'preparing', label: 'En préparation', icon: Package },
  { status: 'shipping', label: 'En livraison', icon: Truck },
  { status: 'delivered', label: 'Livré', icon: CheckCircle },
];

const OrderTracker: React.FC<OrderTrackerProps> = ({ status, updatedAt, estimatedDelivery }) => {
  const currentStepIndex = statusSteps.findIndex((step) => step.status === status);

  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
        <XCircle className="h-6 w-6 text-red-500 mr-2" />
        <span className="text-red-700">Commande annulée</span>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg">
        <Clock className="h-6 w-6 text-yellow-500 mr-2" />
        <span className="text-yellow-700">En attente de confirmation</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Dernière mise à jour</p>
          <p className="font-medium">
            {new Date(updatedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {estimatedDelivery && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Livraison estimée</p>
            <p className="font-medium">
              {new Date(estimatedDelivery).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%;` }}
        />
        
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.status}
                className={`flex flex-col items-center ${
                  index === 0 ? 'align-start' : index === statusSteps.length - 1 ? 'align-end' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  } ${
                    isCurrent ? 'ring-4 ring-green-100' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;