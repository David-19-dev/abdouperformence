import React, { useState } from 'react';
import { Calendar, Clock, Send, User, Mail, Phone, Target, MessageSquare, CheckCircle, AlertCircle, Star, Award, Users, Dumbbell } from 'lucide-react';
import { sendBookingEmail } from '../lib/email';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'weight-loss',
    preferredDate: '',
    preferredTime: '',
    sessionType: 'personal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const sessionTypes = [
    {
      id: 'personal',
      name: 'Coaching Personnel',
      description: 'Séance individuelle personnalisée',
      price: '25,000 FCFA',
      duration: '60 min',
      icon: <User className="h-6 w-6" />,
      features: ['Programme sur mesure', 'Attention personnalisée', 'Suivi détaillé']
    },
    {
      id: 'group',
      name: 'Cours Collectif',
      description: 'Entraînement en petit groupe',
      price: '15,000 FCFA',
      duration: '45 min',
      icon: <Users className="h-6 w-6" />,
      features: ['Motivation de groupe', 'Prix avantageux', 'Ambiance conviviale']
    },
    {
      id: 'evaluation',
      name: 'Évaluation Initiale',
      description: 'Bilan complet et plan d\'action',
      price: 'Gratuit',
      duration: '30 min',
      icon: <Award className="h-6 w-6" />,
      features: ['Analyse corporelle', 'Plan personnalisé', 'Conseils nutrition']
    }
  ];

  const goals = [
    { id: 'weight-loss', name: 'Perte de poids', icon: '🎯' },
    { id: 'muscle-gain', name: 'Prise de masse', icon: '💪' },
    { id: 'fitness', name: 'Remise en forme', icon: '🏃‍♂️' },
    { id: 'performance', name: 'Performance sportive', icon: '🏆' },
    { id: 'rehabilitation', name: 'Rééducation', icon: '🩺' },
    { id: 'wellness', name: 'Bien-être général', icon: '🧘‍♀️' }
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.sessionType && formData.goal;
      case 2:
        return formData.preferredDate && formData.preferredTime;
      case 3:
        return formData.name.trim() && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && 
               /^(70|75|76|77|78)\d{7}$/.test(formData.phone);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Veuillez remplir tous les champs requis');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email invalide');
      return false;
    }
    if (!formData.phone.trim() || !/^(70|75|76|77|78)\d{7}$/.test(formData.phone)) {
      toast.error('Numéro de téléphone invalide (format: 7X XXX XX XX)');
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.preferredDate);
    if (selectedDate < today) {
      toast.error('La date doit être future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Sauvegarder la réservation dans Firestore
      const bookingData = {
        session_type: formData.sessionType,
        goal: formData.goal,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        message: formData.message,
        status: 'pending',
        contact_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      };

      const bookingsCollection = collection(db, 'bookings');
      const docRef = await addDoc(bookingsCollection, bookingData);

      console.log('✅ Réservation sauvegardée avec ID:', docRef.id);

      // Envoyer l'email de confirmation
      const result = await sendBookingEmail(formData);

      if (result.success) {
        // Messages de succès adaptés au contexte
        let successMessage = 'Réservation effectuée avec succès!';

        if (result.emailStatus === 'simulé_dev') {
          successMessage += ' Notre équipe vous contactera pour confirmer votre créneau.';
        } else if (result.emailStatus === 'service_indisponible') {
          successMessage += ' Un email de confirmation vous sera envoyé dès que possible.';
        } else if (result.emailStatus === 'envoyé') {
          successMessage += ' Vous recevrez un email de confirmation.';
        } else {
          successMessage += ' Notre équipe vous contactera bientôt.';
        }

        toast.success(successMessage);
        setCurrentStep(5); // Success step
      } else {
        // Même si l'email échoue, la réservation est sauvegardée
        toast.success('Réservation enregistrée avec succès! Notre équipe vous contactera bientôt.');
        setCurrentStep(5);
      }
    } catch (error) {
      console.error('Error:', error);

      // Afficher le message d'erreur spécifique
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      goal: 'weight-loss',
      preferredDate: '',
      preferredTime: '',
      sessionType: 'personal',
      message: ''
    });
    setCurrentStep(1);
  };

  const selectedSessionType = sessionTypes.find(type => type.id === formData.sessionType);
  const selectedGoal = goals.find(goal => goal.id === formData.goal);

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Dumbbell className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Réservez Votre Séance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commencez votre transformation avec BBP Performance. 
            Réservez votre première séance en quelques étapes simples.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`
                    h-1 w-24 mx-4
                    ${currentStep > step ? 'bg-red-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Service</span>
            <span>Planning</span>
            <span>Contact</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choisissez votre service
              </h2>
              
              {/* Session Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {sessionTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, sessionType: type.id }))}
                    className={`
                      relative p-6 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.sessionType === type.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`
                        p-3 rounded-lg
                        ${formData.sessionType === type.id ? 'bg-red-100' : 'bg-gray-100'}
                      `}>
                        {type.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{type.price}</div>
                        <div className="text-sm text-gray-500">{type.duration}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {formData.sessionType === type.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Goals */}
              <h3 className="text-xl font-semibold mb-4">Quel est votre objectif principal ?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${formData.goal === goal.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <div className="font-medium">{goal.name}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!validateStep(1)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choisissez votre créneau
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Heure souhaitée
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                        className={`
                          p-2 text-sm rounded-lg border transition-all
                          ${formData.preferredTime === time
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {selectedSessionType && selectedGoal && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Récapitulatif de votre réservation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service :</span>
                      <span className="font-medium">{selectedSessionType.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Objectif :</span>
                      <span className="font-medium">{selectedGoal.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix :</span>
                      <span className="font-bold text-red-600">{selectedSessionType.price}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={nextStep}
                  disabled={!validateStep(2)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Vos informations de contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="7X XXX XX XX"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format requis : 7X XXX XX XX (ex: 77 123 45 67)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-2" />
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Parlez-nous de vos attentes, contraintes ou questions..."
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={nextStep}
                  disabled={!validateStep(3)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Confirmez votre réservation
              </h2>

              <div className="space-y-6">
                {/* Service Details */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Détails du service
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Type de séance :</span>
                      <div className="font-medium">{selectedSessionType?.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Objectif :</span>
                      <div className="font-medium">{selectedGoal?.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Date :</span>
                      <div className="font-medium">
                        {new Date(formData.preferredDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Heure :</span>
                      <div className="font-medium">{formData.preferredTime}</div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-red-600" />
                    Vos informations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Nom :</span>
                      <div className="font-medium">{formData.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Email :</span>
                      <div className="font-medium">{formData.email}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Téléphone :</span>
                      <div className="font-medium">{formData.phone}</div>
                    </div>
                  </div>
                  {formData.message && (
                    <div className="mt-4">
                      <span className="text-gray-600">Message :</span>
                      <div className="font-medium mt-1">{formData.message}</div>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total :</span>
                    <span className="text-2xl font-bold text-red-600">
                      {selectedSessionType?.price}
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    * Le paiement se fera lors de votre venue
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Confirmation...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Confirmer la réservation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Réservation confirmée !
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Votre réservation a été enregistrée avec succès. Vous recevrez un email de confirmation dans quelques minutes.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">Prochaines étapes :</h3>
                <ul className="text-left space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Votre réservation a été enregistrée
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Notre équipe vous contactera pour confirmer le créneau
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Préparez-vous pour votre séance !
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Nouvelle réservation
                </button>
                <a
                  href="/"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-900 text-white rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-gray-300">Notre équipe est là pour vous accompagner</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Phone className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="font-medium">Téléphone</div>
                <div className="text-gray-300">+221 77 123 45 67</div>
              </div>
              <div>
                <Mail className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="font-medium">Email</div>
                <div className="text-gray-300">{import.meta.env.VITE_CONTACT_EMAIL || 'contact@bambaperformance.com'}</div>
              </div>
              <div>
                <Clock className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="font-medium">Horaires</div>
                <div className="text-gray-300">Lun-Ven: 6h-21h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingPage;