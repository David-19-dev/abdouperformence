import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut, isAdmin } from '../../lib/auth';
import toast from 'react-hot-toast';
import { Dumbbell, Lock, Mail, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Début de la tentative de connexion');
    console.log('📧 Email:', email);
    
    setLoading(true);

    try {
      // Vérifier que Firebase est configuré
      if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
        toast.error('Configuration Firebase manquante. Veuillez configurer la base de données.');
        return;
      }
      
      const data = await signIn(email, password);
      
      if (data.user) {
        console.log('✅ Connexion réussie, vérification des droits admin...');
        
        // Vérifier si l'utilisateur est admin
        const adminCheck = await isAdmin();
        if (!adminCheck) {
          await signOut();
          toast.error('Accès refusé. Seuls les administrateurs peuvent accéder à cette section.');
          return;
        }
        
        toast.success('Connexion réussie');
        console.log('🎯 Redirection vers /admin');
        navigate('/admin');
      }
    } catch (error) {
      console.error('💥 Erreur lors de la connexion:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Firebase')) {
          toast.error('Base de données non configurée. Veuillez contacter l\'administrateur.');
        } else if (error.message.includes('auth/invalid-credential') || error.message.includes('auth/user-not-found') || error.message.includes('auth/wrong-password')) {
          toast.error('Email ou mot de passe incorrect');
        } else if (error.message.includes('auth/too-many-requests')) {
          toast.error('Trop de tentatives. Veuillez réessayer plus tard.');
        } else {
          toast.error(`Erreur: ${error.message}`);
        }
      } else {
        toast.error('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo et Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
            <Dumbbell className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            BBP Performance
          </h2>
          <p className="text-blue-100 text-lg">
            Administration
          </p>
          <div className="flex items-center justify-center mt-4 text-blue-200">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm">Accès sécurisé administrateur</span>
          </div>
          
          {/* Avertissement administrateur */}
          <div className="mt-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center text-red-200">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Zone réservée aux administrateurs uniquement
              </span>
            </div>
            <p className="text-xs text-red-300 text-center mt-2">
              Accès non autorisé strictement interdit
            </p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Champ Email */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-white mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-xs text-blue-200">
                Connexion sécurisée avec chiffrement SSL
              </p>
              <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-blue-300">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Authentification
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Chiffrement
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Protection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-blue-200">
            © 2024 BBP Performance. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;