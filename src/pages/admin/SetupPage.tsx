import React, { useState } from 'react';
import { setupFirebaseCollections, checkFirebaseSetup } from '../../lib/firebase-setup';
import { Database, User, ShoppingBag, FileText, Video, CheckCircle, AlertCircle, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const SetupPage: React.FC = () => {
  const [setupStatus, setSetupStatus] = useState({
    connection: false,
    admin: false,
    collections: false,
    sampleData: false
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const setupSteps = [
    {
      id: 'connection',
      title: 'Vérification de la connexion',
      description: 'Test de la connexion à Firebase',
      icon: Database
    },
    {
      id: 'admin',
      title: 'Création de l\'administrateur',
      description: 'Création du compte admin par défaut',
      icon: User
    },
    {
      id: 'collections',
      title: 'Configuration des collections',
      description: 'Création des collections Firestore',
      icon: Database
    },
    {
      id: 'sampleData',
      title: 'Données d\'exemple',
      description: 'Ajout de produits, articles et vidéos d\'exemple',
      icon: ShoppingBag
    }
  ];

  const runSetup = async () => {
    setLoading(true);
    setCurrentStep(0);

    try {
      // Étape 1: Vérifier la connexion Firebase
      setCurrentStep(1);
      const connectionOk = await checkFirebaseSetup();
      setSetupStatus(prev => ({ ...prev, connection: connectionOk }));
      
      if (!connectionOk) {
        toast.error('Erreur de connexion à Firebase');
        return;
      }

      // Étape 2: Créer l'utilisateur admin
      setCurrentStep(2);
      const setupResult = await setupFirebaseCollections();
      setSetupStatus(prev => ({ ...prev, admin: setupResult }));
      
      if (!setupResult) {
        toast.error('Erreur lors de la création de l\'utilisateur admin');
        return;
      }
      
      setCurrentStep(3);
      
      // Créer les collections de base
      setSetupStatus(prev => ({ ...prev, collections: true }));
      setCurrentStep(4);
      
      // Marquer les données d'exemple comme créées
      setSetupStatus(prev => ({ ...prev, sampleData: true }));
      
      toast.success('Configuration Firebase terminée avec succès !');
      toast.success('Utilisateur admin créé. Vous pouvez maintenant vous connecter.');
    } catch (error) {
      console.error('Erreur setup:', error);
      toast.error(`Erreur lors de la configuration: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return setupStatus.connection;
      case 1: return setupStatus.admin;
      case 2: return setupStatus.collections;
      case 3: return setupStatus.sampleData;
      default: return false;
    }
  };

  const isStepCurrent = (stepIndex: number) => {
    return loading && currentStep === stepIndex + 1;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuration Firebase</h1>
        <p className="text-gray-600">
          Configurez votre base de données Firebase et créez les données initiales pour BBP Performance.
        </p>
      </div>

      {/* Informations de connexion */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Informations de connexion admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700">Email</label>
            <code className="block bg-white px-3 py-2 rounded border text-sm">admin@bambaperformance.com</code>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Mot de passe</label>
            <code className="block bg-white px-3 py-2 rounded border text-sm">!*$Root-1!*$</code>
          </div>
        </div>
        <p className="text-sm text-blue-600 mt-3">
          Ces identifiants seront créés automatiquement lors de la configuration.
        </p>
      </div>

      {/* Étapes de configuration */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Étapes de configuration</h2>
        
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const Icon = step.icon;
            const completed = isStepCompleted(index);
            const current = isStepCurrent(index);
            
            return (
              <div
                key={step.id}
                className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                  completed
                    ? 'border-green-200 bg-green-50'
                    : current
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  completed
                    ? 'bg-green-500 text-white'
                    : current
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : current ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className={`font-medium ${
                    completed ? 'text-green-900' : current ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    completed ? 'text-green-600' : current ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
                
                {completed && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bouton de configuration */}
      <div className="text-center">
        <button
          onClick={runSetup}
          disabled={loading}
          className={`inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Configuration en cours...
            </>
          ) : (
            <>
              <Play className="h-6 w-6 mr-3" />
              Lancer la configuration
            </>
          )}
        </button>
      </div>

      {/* Statut de configuration */}
      {Object.values(setupStatus).some(status => status) && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de la configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg text-center ${
              setupStatus.connection ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <Database className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Connexion</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              setupStatus.admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <User className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Admin</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              setupStatus.collections ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Collections</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              setupStatus.sampleData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <ShoppingBag className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Données</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions post-configuration */}
      {Object.values(setupStatus).every(status => status) && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">Vérification terminée !</h3>
          </div>
          <div className="text-green-800">
            <p className="mb-4">Suivez maintenant le guide de configuration manuelle :</p>
            <ul className="list-disc list-inside space-y-2">
              <li>📖 Consultez le guide GUIDE_CONFIGURATION_FIREBASE.md</li>
              <li>🔥 Activez Firestore Database dans Firebase Console</li>
              <li>👤 Créez l'utilisateur admin manuellement</li>
              <li>🛡️ Configurez les règles de sécurité</li>
            </ul>
            <div className="mt-4 p-4 bg-white rounded border">
              <p className="font-medium">Une fois la configuration manuelle terminée :</p>
              <ul className="mt-2 space-y-1">
                <li>• Connectez-vous avec admin@bambaperformance.com</li>
                <li>• Gérer les réservations, produits, articles et vidéos</li>
                <li>• Personnaliser le contenu selon vos besoins</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPage;