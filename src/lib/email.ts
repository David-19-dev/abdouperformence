import { createBooking } from './firestore';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  goal: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

// Fonction pour valider les données de réservation
const validateBookingData = (bookingData: BookingData): string[] => {
  const errors: string[] = [];
  
  if (!bookingData.name?.trim()) {
    errors.push('Le nom est requis');
  } else if (bookingData.name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  
  if (!bookingData.email?.trim()) {
    errors.push('L\'email est requis');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email.trim())) {
    errors.push('Format d\'email invalide');
  }
  
  if (!bookingData.phone?.trim()) {
    errors.push('Le téléphone est requis');
  } else if (!/^(70|75|76|77|78)\d{7}$/.test(bookingData.phone.trim())) {
    errors.push('Format de téléphone invalide (format requis: 7X XXX XX XX)');
  }
  
  if (!bookingData.sessionType?.trim()) {
    errors.push('Type de séance requis');
  }
  
  if (!bookingData.goal?.trim()) {
    errors.push('Objectif requis');
  }
  
  if (!bookingData.preferredDate?.trim()) {
    errors.push('Date requise');
  } else {
    const selectedDate = new Date(bookingData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.push('La date doit être future');
    }
  }
  
  if (!bookingData.preferredTime?.trim()) {
    errors.push('Heure requise');
  }
  
  return errors;
};

export const sendBookingEmail = async (bookingData: BookingData) => {
  try {
    console.log('🚀 Début du processus de réservation...', {
      name: bookingData.name,
      email: bookingData.email,
      sessionType: bookingData.sessionType,
      date: bookingData.preferredDate,
      time: bookingData.preferredTime
    });

    // Validation des données
    const validationErrors = validateBookingData(bookingData);
    if (validationErrors.length > 0) {
      console.error('❌ Erreurs de validation:', validationErrors);
      throw new Error(`Données invalides: ${validationErrors.join(', ')}`);
    }

    console.log('✅ Validation des données réussie');

    // Créer la réservation dans Firebase
    const booking = await createBooking({
      sessionType: bookingData.sessionType,
      goal: bookingData.goal,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      message: bookingData.message || '',
      status: 'pending',
      contactInfo: {
        name: bookingData.name.trim(),
        email: bookingData.email.trim().toLowerCase(),
        phone: bookingData.phone.trim()
      }
    });

    console.log('✅ Réservation créée avec succès:', booking.id);

    // Simuler l'envoi d'email avec délai réaliste
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: 'Réservation confirmée',
      booking: {
        id: booking.id,
        status: 'pending'
      },
      emailStatus: 'simulé'
    };

  } catch (error) {
    console.error('💥 Erreur dans sendBookingEmail:', error);
    
    // Fournir des messages d'erreur plus informatifs
    if (error instanceof Error) {
      if (error.message.includes('Données invalides')) {
        throw error;
      }
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('TypeError')) {
        throw new Error('Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.');
      }
    }
    
    throw new Error('Une erreur inattendue est survenue. Veuillez réessayer dans quelques instants.');
  }
};

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    console.log('📧 Traitement du message de contact...', {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject
    });

    // Validation basique
    if (!contactData.name?.trim()) {
      throw new Error('Le nom est requis');
    }
    if (!contactData.email?.trim()) {
      throw new Error('L\'email est requis');
    }
    if (!contactData.subject?.trim()) {
      throw new Error('Le sujet est requis');
    }
    if (!contactData.message?.trim()) {
      throw new Error('Le message est requis');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      throw new Error('Format d\'email invalide');
    }

    // Simuler l'envoi avec délai réaliste
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Message de contact traité avec succès');
    
    return { 
      success: true,
      message: 'Message envoyé avec succès'
    };

  } catch (error) {
    console.error('💥 Erreur dans sendContactEmail:', error);
    throw error instanceof Error ? error : new Error('Erreur lors de l\'envoi du message de contact');
  }
};