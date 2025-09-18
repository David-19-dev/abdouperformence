import React, { useState } from 'react';
import { X, Phone, AlertCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrdersStore } from '../store/orders';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  items,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  const addOrder = useOrdersStore((state) => state.addOrder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(70|75|76|77|78)\d{7}$/)) {
      toast.error('Numéro de téléphone invalide');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      toast.error('Veuillez remplir toutes les informations de livraison');
      return;
    }

    setIsProcessing(true);

    try {
      // Simuler une requête de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer la commande
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

      addOrder({
        items,
        total: amount,
        status: 'confirmed',
        shippingAddress,
        estimatedDelivery: estimatedDelivery.toISOString(),
        trackingNumber: `TRK-${Date.now()};`,
      });

      toast.success('Commande créée avec succès!');
      onPaymentComplete();
      onClose();
    } catch (error) {
      toast.error('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-2">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-sm rounded-lg bg-white p-4">
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-4 text-xl font-bold">Finaliser la commande</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informations de livraison */}
            <div>
              <h3 className="text-base font-medium mb-3">Adresse de livraison</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress(prev => ({
                      ...prev,
                      fullName: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress(prev => ({
                      ...prev,
                      address: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Méthodes de paiement */}
            <div>
              <h3 className="text-base font-medium mb-3">Méthode de paiement</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={`flex flex-col items-center rounded-lg border p-3 transition-colors ${
                    paymentMethod === 'wave'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span className="text-xs font-medium">Wave</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange')}
                  className={`flex flex-col items-center rounded-lg border p-3 transition-colors ${
                    paymentMethod === 'orange'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mb-1">
                    <span className="text-white font-bold text-sm">OM</span>
                  </div>
                  <span className="text-xs font-medium">Orange Money</span>
                </button>
              </div>
            </div>

            {paymentMethod && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Numéro de téléphone pour le paiement
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="7X XXX XX XX"
                    className="w-full rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 text-sm">Total à payer</span>
                <span className="text-xl font-bold text-red-600">
                  {amount.toLocaleString()} FCFA
                </span>
              </div>

              <button
                type="submit"
                disabled={!paymentMethod || isProcessing}
                className={`w-full rounded-lg bg-red-600 py-2 text-white transition-colors text-sm ${
                  isProcessing || !paymentMethod
                    ? 'cursor-not-allowed opacity-75'
                    : 'hover:bg-red-700'
                }`}
              >
                {isProcessing ? 'Traitement en cours...' : 'Confirmer la commande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;