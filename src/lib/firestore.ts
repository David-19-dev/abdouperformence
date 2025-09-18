import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types pour les collections
export interface Booking {
  id?: string;
  sessionType: string;
  goal: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: Timestamp;
  readTime: string;
  featured: boolean;
  slug: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
  discount?: number;
  rating?: number;
  reviews_count?: number;
  details?: {
    brand?: string;
    weight?: string;
    ingredients?: string[];
    benefits?: string[];
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface User {
  id?: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: Timestamp;
}

export interface Comment {
  id?: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: string; // Pour les réponses aux commentaires
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Fonctions pour les réservations
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: now,
      updatedAt: now
    });
    console.log('✅ Réservation créée avec ID:', docRef.id);
    return { id: docRef.id, ...bookingData };
  } catch (error) {
    console.error('❌ Erreur création réservation:', error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return bookings;
  } catch (error) {
    console.error('❌ Erreur récupération réservations:', error);
    throw error;
  }
};

export const updateBooking = async (id: string, updates: Partial<Booking>) => {
  try {
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Réservation mise à jour:', id);
  } catch (error) {
    console.error('❌ Erreur mise à jour réservation:', error);
    throw error;
  }
};

export const deleteBooking = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'bookings', id));
    console.log('✅ Réservation supprimée:', id);
  } catch (error) {
    console.error('❌ Erreur suppression réservation:', error);
    throw error;
  }
};

// Fonctions pour les articles de blog
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'blog_posts'), {
      ...postData,
      createdAt: now,
      updatedAt: now
    });
    return { id: docRef.id, ...postData };
  } catch (error) {
    console.error('❌ Erreur création article:', error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const q = query(collection(db, 'blog_posts'), orderBy('publishedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Erreur récupération articles:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  try {
    const postRef = doc(db, 'blog_posts', id);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Article mis à jour:', id);
  } catch (error) {
    console.error('❌ Erreur mise à jour article:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'blog_posts', id));
    console.log('✅ Article supprimé:', id);
  } catch (error) {
    console.error('❌ Erreur suppression article:', error);
    throw error;
  }
};

// Fonctions pour les produits
export const getProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    return products;
  } catch (error) {
    console.error('❌ Erreur récupération produits:', error);
    throw error;
  }
};

// Fonctions pour les commentaires
export const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    });
    return { id: docRef.id, ...commentData };
  } catch (error) {
    console.error('❌ Erreur création commentaire:', error);
    throw error;
  }
};

export const getCommentsByPost = async (postId: string) => {
  try {
    const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Erreur récupération commentaires:', error);
    throw error;
  }
};

export const updateComment = async (id: string, updates: Partial<Comment>) => {
  try {
    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Commentaire mis à jour:', id);
  } catch (error) {
    console.error('❌ Erreur mise à jour commentaire:', error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'comments', id));
    console.log('✅ Commentaire supprimé:', id);
  } catch (error) {
    console.error('❌ Erreur suppression commentaire:', error);
    throw error;
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('❌ Erreur création produit:', error);
    throw error;
  }
};

// Fonctions pour les utilisateurs
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error);
    throw error;
  }
};

export const getUser = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    throw error;
  }
};