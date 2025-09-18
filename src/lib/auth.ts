import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Tentative de connexion pour:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Connexion réussie:', user.email);
    return { user };
  } catch (error) {
    console.error('❌ Erreur de connexion Firebase:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('✅ Déconnexion réussie');
  } catch (error) {
    console.error('❌ Erreur de déconnexion:', error);
    throw error;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    console.log('🔍 Vérification du rôle admin...');
    
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Aucun utilisateur connecté');
      return false;
    }
    
    console.log('👤 Utilisateur connecté:', user.email, 'UID:', user.uid);
    
    // Forcer le rafraîchissement du token d'authentification
    await user.getIdToken(true);
    
    // Vérifier si l'email correspond à l'admin
    const isAdminEmail = user.email === 'admin@bambaperformance.com';
    console.log('🔐 Email admin vérifié:', isAdminEmail);
    
    return isAdminEmail;
  } catch (error) {
    console.error('💥 Erreur dans isAdmin:', error);
    return false;
  }
};

export const requireAdmin = async (): Promise<boolean> => {
  console.log('🛡️ Vérification des droits admin requis...');
  const admin = await isAdmin();
  if (!admin) {
    console.log('❌ Accès refusé - droits admin requis');
    window.location.href = '/login';
    return false;
  }
  console.log('✅ Accès autorisé - utilisateur admin');
  return true;
};

// Fonction pour écouter les changements d'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};