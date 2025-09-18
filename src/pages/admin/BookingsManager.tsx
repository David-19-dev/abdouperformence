import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Calendar, Clock, User, Phone, Mail, MessageSquare, Filter, Download, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { collection, getDocs, updateDoc, deleteDoc, doc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  session_type: string;
  goal: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

const BookingsManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmé', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' }
  ];

  const sessionTypeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'personal', label: 'Coaching Personnel' },
    { value: 'group', label: 'Cours Collectif' },
    { value: 'evaluation', label: 'Évaluation Initiale' }
  ];

  const goalOptions: { [key: string]: string } = {
    'weight-loss': 'Perte de poids',
    'muscle-gain': 'Prise de masse',
    'fitness': 'Remise en forme',
    'performance': 'Performance sportive',
    'rehabilitation': 'Rééducation',
    'wellness': 'Bien-être général'
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter, sessionTypeFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.contact_info.name.toLowerCase().includes(term) ||
        booking.contact_info.email.toLowerCase().includes(term) ||
        booking.contact_info.phone.includes(term) ||
        booking.id.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filtre par type de session
    if (sessionTypeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.session_type === sessionTypeFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => booking.preferred_date === todayStr);
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.preferred_date);
            return bookingDate >= today && bookingDate <= weekFromNow;
          });
          break;
        case 'month':
          const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.preferred_date);
            return bookingDate >= today && bookingDate <= monthFromNow;
          });
          break;
        case 'past':
          filtered = filtered.filter(booking => new Date(booking.preferred_date) < today);
          break;
      }
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updated_at: Timestamp.now()
      });

      toast.success('Statut mis à jour avec succès');
      fetchBookings();

      // Mettre à jour la réservation sélectionnée si elle est ouverte
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);

      toast.success('Réservation supprimée avec succès');
      fetchBookings();

      if (selectedBooking && selectedBooking.id === bookingId) {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const exportBookings = () => {
    const csvContent = [
      ['ID', 'Nom', 'Email', 'Téléphone', 'Type de session', 'Objectif', 'Date', 'Heure', 'Statut', 'Message', 'Créé le'].join(','),
      ...filteredBookings.map(booking => [
        booking.id.slice(0, 8),
        booking.contact_info.name,
        booking.contact_info.email,
        booking.contact_info.phone,
        sessionTypeOptions.find(opt => opt.value === booking.session_type)?.label || booking.session_type,
        goalOptions[booking.goal] || booking.goal,
        new Date(booking.preferred_date).toLocaleDateString('fr-FR'),
        booking.preferred_time,
        statusOptions.find(opt => opt.value === booking.status)?.label || booking.status,
        `"${booking.message || ''}"`,
        new Date(booking.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export CSV généré avec succès');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600 mt-1">
            {filteredBookings.length} réservation{filteredBookings.length > 1 ? 's' : ''} 
            {filteredBookings.length !== bookings.length && ` sur ${bookings.length} au total`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportBookings}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter CSV
          </button>
          <button
            onClick={fetchBookings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de session
            </label>
            <select
              value={sessionTypeFilter}
              onChange={(e) => setSessionTypeFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {sessionTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="past">Passées</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
                setSessionTypeFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statusOptions.slice(1).map(status => {
          const count = bookings.filter(b => b.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${status.color}`}>
                  {getStatusIcon(status.value)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table des réservations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.contact_info.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.contact_info.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.contact_info.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sessionTypeOptions.find(opt => opt.value === booking.session_type)?.label || booking.session_type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {goalOptions[booking.goal] || booking.goal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(booking.preferred_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {booking.preferred_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">
                        {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(booking.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune réservation</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || sessionTypeFilter !== 'all'
                ? 'Aucune réservation ne correspond aux filtres sélectionnés.'
                : 'Aucune réservation n\'a été trouvée.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Détails de la réservation
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informations client */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-red-600" />
                      Informations client
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nom</label>
                        <p className="text-sm text-gray-900">{selectedBooking.contact_info.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          <a 
                            href={`mailto:${selectedBooking.contact_info.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {selectedBooking.contact_info.email}
                          </a>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          <a 
                            href={`tel:${selectedBooking.contact_info.phone}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {selectedBooking.contact_info.phone}
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
                          {sessionTypeOptions.find(opt => opt.value === selectedBooking.session_type)?.label || selectedBooking.session_type}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Objectif</label>
                        <p className="text-sm text-gray-900">
                          {goalOptions[selectedBooking.goal] || selectedBooking.goal}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Date souhaitée</label>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedBooking.preferred_date)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Heure souhaitée</label>
                        <p className="text-sm text-gray-900">{selectedBooking.preferred_time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {selectedBooking.message && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-red-600" />
                        Message du client
                      </h3>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedBooking.message}
                      </p>
                    </div>
                  )}

                  {/* Statut et actions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Gestion de la réservation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Statut actuel
                        </label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)}
                          <span className="ml-1">
                            {statusOptions.find(opt => opt.value === selectedBooking.status)?.label || selectedBooking.status}
                          </span>
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Changer le statut
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.slice(1).map(status => (
                            <button
                              key={status.value}
                              onClick={() => updateBookingStatus(selectedBooking.id, status.value)}
                              disabled={selectedBooking.status === status.value}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                selectedBooking.status === status.value
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="text-xs text-gray-500 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>ID:</strong> {selectedBooking.id.slice(0, 8)}
                      </div>
                      <div>
                        <strong>Créé le:</strong> {formatDateTime(selectedBooking.created_at)}
                      </div>
                      <div>
                        <strong>Modifié le:</strong> {formatDateTime(selectedBooking.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={() => deleteBooking(selectedBooking.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;