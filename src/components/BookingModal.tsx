import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { updateBooking } from '../lib/firestore';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  selectedSlot?: { start: Date; end: Date };
  onBookingUpdate?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  selectedSlot,
  onBookingUpdate
}) => {
  const [status, setStatus] = useState(booking?.status || 'pending');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const updateBookingStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateBooking(booking.id, { status: newStatus });

      setStatus(newStatus);
      toast.success('Statut mis à jour avec succès');
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const sessionTypeLabels = {
    'personal': 'Coaching Personnel',
    'group': 'Cours Collectif',
    'evaluation': 'Évaluation Initiale'
  };

  const goalLabels = {
    'weight-loss': 'Perte de poids',
    'muscle-gain': 'Prise de masse',
    'fitness': 'Remise en forme',
    'performance': 'Performance sportive',
    'rehabilitation': 'Rééducation',
    'wellness': 'Bien-être général'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {booking ? 'Détails de la réservation' : 'Nouveau créneau'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {booking ? (
              <div className="space-y-6">
                {/* Statut actuel */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                  <div className="text-sm text-gray-500">
                    ID: {booking.id.slice(0, 8)}
                  </div>
                </div>

                {/* Informations client */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-red-600" />
                    Informations client
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nom</label>
                      <p className="text-sm text-gray-900">{booking.contactInfo.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        <a 
                          href={`mailto:${booking.contactInfo.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {booking.contactInfo.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        <a 
                          href={`tel:${booking.contactInfo.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {booking.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails de la session */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Détails de la session
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Type de session</label>
                      <p className="text-sm text-gray-900">
                        {sessionTypeLabels[booking.sessionType] || booking.sessionType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Objectif</label>
                      <p className="text-sm text-gray-900">
                        {goalLabels[booking.goal] || booking.goal}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date</label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {new Date(booking.preferredDate).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Heure</label>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <p className="text-sm text-gray-900">{booking.preferredTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-red-600" />
                      Message du client
                    </h3>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {booking.message}
                    </p>
                  </div>
                )}

                {/* Actions de statut */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {status !== 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus('confirmed')}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer
                      </button>
                    )}
                    {status !== 'completed' && status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus('completed')}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer terminé
                      </button>
                    )}
                    {status !== 'cancelled' && (
                      <button
                        onClick={() => updateBookingStatus('cancelled')}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Créneau disponible
                </h3>
                <p className="text-gray-600">
                  {selectedSlot?.start.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} à {selectedSlot?.start.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Aucune réservation pour ce créneau
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;