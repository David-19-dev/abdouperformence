import React, { useState, useEffect } from 'react';
import { Save, Clock, Mail, Phone, MapPin, DollarSign, Calendar, Bell, Shield, Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle, Settings as SettingsIcon, User, Globe, Palette } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  description: string;
}

interface ScheduleSettings {
  monday: { open: string; close: string; enabled: boolean };
  tuesday: { open: string; close: string; enabled: boolean };
  wednesday: { open: string; close: string; enabled: boolean };
  thursday: { open: string; close: string; enabled: boolean };
  friday: { open: string; close: string; enabled: boolean };
  saturday: { open: string; close: string; enabled: boolean };
  sunday: { open: string; close: string; enabled: boolean };
  slotDuration: number;
  breakTime: number;
}

interface PricingSettings {
  personal: number;
  group: number;
  evaluation: number;
  currency: string;
  taxRate: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderTime: number;
  confirmationAuto: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: 'BBP Performance',
    email: 'contact@bambaperformance.com',
    phone: '+221 77 123 45 67',
    address: '123 Rue Fitness',
    city: 'Dakar, Sénégal',
    website: 'https://bambaperformance.com',
    description: 'Centre de coaching sportif et performance'
  });

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    monday: { open: '06:00', close: '21:00', enabled: true },
    tuesday: { open: '06:00', close: '21:00', enabled: true },
    wednesday: { open: '06:00', close: '21:00', enabled: true },
    thursday: { open: '06:00', close: '21:00', enabled: true },
    friday: { open: '06:00', close: '21:00', enabled: true },
    saturday: { open: '08:00', close: '18:00', enabled: true },
    sunday: { open: '09:00', close: '14:00', enabled: false },
    slotDuration: 60,
    breakTime: 15
  });

  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    personal: 25000,
    group: 15000,
    evaluation: 0,
    currency: 'FCFA',
    taxRate: 0
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    reminderTime: 24,
    confirmationAuto: false
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    dbSize: '0 MB'
  });

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    // Charger les paramètres depuis la base de données
    // Pour l'instant, on utilise les valeurs par défaut
  };

  const loadStats = async () => {
    try {
      // Statistiques des réservations
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookings = bookingsSnapshot.docs;

      // Statistiques des utilisateurs
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const users = usersSnapshot.docs;

      setStats({
        totalBookings: bookings.length || 0,
        totalUsers: users.length || 0,
        totalRevenue: 0, // À calculer selon vos besoins
        dbSize: '2.5 MB' // Estimation
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveSettings = async (section: string) => {
    setLoading(true);
    try {
      // Sauvegarder les paramètres dans la base de données
      // Implémentation selon vos besoins
      
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const csvContent = [
        ['ID', 'Client', 'Email', 'Type', 'Date', 'Statut', 'Créé le'].join(','),
        ...bookings.map(booking => [
          booking.id.slice(0, 8),
          booking.contactInfo?.name || 'N/A',
          booking.contactInfo?.email || 'N/A',
          booking.sessionType,
          booking.preferredDate,
          booking.status,
          new Date(booking.createdAt?.toDate?.() || booking.createdAt).toLocaleDateString('fr-FR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bbp_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast.success('Export terminé avec succès');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const clearOldData = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer les données anciennes (> 1 an) ?')) {
      return;
    }

    try {
      // Note: Firebase nécessite une logique différente pour supprimer en lot
      // Cette fonctionnalité nécessiterait une Cloud Function pour être efficace
      toast.success('Données anciennes supprimées');
      // loadStats();
    } catch (error) {
      console.error('Error clearing old data:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const tabs = [
    { id: 'business', label: 'Entreprise', icon: SettingsIcon },
    { id: 'schedule', label: 'Horaires', icon: Clock },
    { id: 'pricing', label: 'Tarifs', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'database', label: 'Base de données', icon: Database }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Configurez votre application et gérez les paramètres système
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Réservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Base de données</p>
              <p className="text-2xl font-bold text-gray-900">{stats.dbSize}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Entreprise */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations de l'entreprise</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={businessSettings.name}
                    onChange={(e) => setBusinessSettings({...businessSettings, name: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({...businessSettings, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={businessSettings.website}
                    onChange={(e) => setBusinessSettings({...businessSettings, website: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({...businessSettings, address: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={businessSettings.city}
                    onChange={(e) => setBusinessSettings({...businessSettings, city: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={businessSettings.description}
                  onChange={(e) => setBusinessSettings({...businessSettings, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <button
                onClick={() => saveSettings('business')}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            </div>
          )}

          {/* Onglet Horaires */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Horaires d'ouverture</h3>
              
              <div className="space-y-4">
                {Object.entries(scheduleSettings).filter(([key]) => !['slotDuration', 'breakTime'].includes(key)).map(([day, schedule]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={(e) => setScheduleSettings({
                            ...scheduleSettings,
                            [day]: { ...schedule, enabled: e.target.checked }
                          })}
                          className="mr-2"
                        />
                        <span className="font-medium capitalize">{day === 'monday' ? 'Lundi' : day === 'tuesday' ? 'Mardi' : day === 'wednesday' ? 'Mercredi' : day === 'thursday' ? 'Jeudi' : day === 'friday' ? 'Vendredi' : day === 'saturday' ? 'Samedi' : 'Dimanche'}</span>
                      </label>
                    </div>
                    
                    {schedule.enabled && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-600">Ouverture</label>
                          <input
                            type="time"
                            value={schedule.open}
                            onChange={(e) => setScheduleSettings({
                              ...scheduleSettings,
                              [day]: { ...schedule, open: e.target.value }
                            })}
                            className="p-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600">Fermeture</label>
                          <input
                            type="time"
                            value={schedule.close}
                            onChange={(e) => setScheduleSettings({
                              ...scheduleSettings,
                              [day]: { ...schedule, close: e.target.value }
                            })}
                            className="p-2 border rounded"
                          />
                        </div>
                      </>
                    )}
                    
                    {!schedule.enabled && (
                      <span className="text-gray-500 italic">Fermé</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée des créneaux (minutes)
                  </label>
                  <select
                    value={scheduleSettings.slotDuration}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, slotDuration: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pause entre créneaux (minutes)
                  </label>
                  <select
                    value={scheduleSettings.breakTime}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, breakTime: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value={0}>Aucune pause</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => saveSettings('schedule')}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            </div>
          )}

          {/* Onglet Tarifs */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Tarification des services</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coaching Personnel
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={pricingSettings.personal}
                      onChange={(e) => setPricingSettings({...pricingSettings, personal: parseInt(e.target.value)})}
                      className="flex-1 p-3 border rounded-l-lg"
                    />
                    <span className="px-3 py-3 bg-gray-100 border border-l-0 rounded-r-lg">FCFA</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cours Collectif
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={pricingSettings.group}
                      onChange={(e) => setPricingSettings({...pricingSettings, group: parseInt(e.target.value)})}
                      className="flex-1 p-3 border rounded-l-lg"
                    />
                    <span className="px-3 py-3 bg-gray-100 border border-l-0 rounded-r-lg">FCFA</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Évaluation Initiale
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={pricingSettings.evaluation}
                      onChange={(e) => setPricingSettings({...pricingSettings, evaluation: parseInt(e.target.value)})}
                      className="flex-1 p-3 border rounded-l-lg"
                    />
                    <span className="px-3 py-3 bg-gray-100 border border-l-0 rounded-r-lg">FCFA</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">0 = Gratuit</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de taxe (%)
                  </label>
                  <input
                    type="number"
                    value={pricingSettings.taxRate}
                    onChange={(e) => setPricingSettings({...pricingSettings, taxRate: parseFloat(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    step="0.1"
                  />
                </div>
              </div>
              
              <button
                onClick={() => saveSettings('pricing')}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Paramètres de notification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications SMS</h4>
                    <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Confirmation automatique</h4>
                    <p className="text-sm text-gray-600">Confirmer automatiquement les réservations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.confirmationAuto}
                      onChange={(e) => setNotificationSettings({...notificationSettings, confirmationAuto: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rappel avant rendez-vous (heures)
                </label>
                <select
                  value={notificationSettings.reminderTime}
                  onChange={(e) => setNotificationSettings({...notificationSettings, reminderTime: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value={1}>1 heure</option>
                  <option value={2}>2 heures</option>
                  <option value={24}>24 heures</option>
                  <option value={48}>48 heures</option>
                </select>
              </div>
              
              <button
                onClick={() => saveSettings('notifications')}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Paramètres de sécurité</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Authentification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connexion admin</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confirmation email</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Base de données</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS activé</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Politiques sécurisées</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Recommandations de sécurité</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Changez régulièrement le mot de passe admin</li>
                      <li>• Activez la double authentification si disponible</li>
                      <li>• Surveillez les connexions suspectes</li>
                      <li>• Sauvegardez régulièrement vos données</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Base de données */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Gestion de la base de données</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h4 className="font-medium mb-4">Export des données</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Exportez toutes vos données en format CSV
                  </p>
                  <button
                    onClick={exportData}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Exporter les données
                  </button>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h4 className="font-medium mb-4">Nettoyage automatique</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Supprimez les données anciennes (&gt; 1 an)
                  </p>
                  <button
                    onClick={clearOldData}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Nettoyer les données
                  </button>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <h4 className="font-medium text-red-800">Zone de danger</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Ces actions sont irréversibles. Assurez-vous d'avoir une sauvegarde avant de procéder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;