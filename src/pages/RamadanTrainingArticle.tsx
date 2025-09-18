import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle, Moon, Sun, Droplets, Dumbbell, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RamadanTrainingArticle: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(89);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    if (!isLiked) {
      toast.success('Article ajouté aux favoris !');
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = "S'entraîner pendant le Ramadan - BBP Performance";
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success('Lien copié dans le presse-papier !');
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.error('Erreur lors de la copie du lien');
        }
        break;
    }
  };

  const relatedArticles = [
    {
      id: 1,
      title: "Comment optimiser sa récupération musculaire",
      image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Les bases d'une nutrition pré et post-entraînement",
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Guide complet des exercices de musculation",
      image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "12 min"
    }
  ];

  const trainingTimes = [
    {
      time: "Après l'iftar (21h30)",
      description: "Meilleur moment pour une séance complète",
      pros: ["Corps hydraté et nourri", "Énergie optimale", "Récupération facilitée"],
      cons: ["Attendre 1h après le repas"],
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-500"
    },
    {
      time: "Avant l'iftar (20h)",
      description: "Séance courte et légère",
      pros: ["Motivation pour la rupture", "Séance courte efficace"],
      cons: ["Déshydratation", "Énergie limitée"],
      color: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-500"
    },
    {
      time: "Après le suhoor (6h)",
      description: "Pour les matinaux",
      pros: ["Énergie encore correcte", "Journée libre"],
      cons: ["Risque de transpiration", "Fatigue pour la journée"],
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-500"
    }
  ];

  const workoutTypes = [
    {
      type: "Musculation modérée",
      description: "Séries plus légères, exercices polyarticulaires",
      exercises: ["Squat", "Pompes", "Tractions", "Développé couché"],
      icon: "💪",
      color: "bg-red-50"
    },
    {
      type: "Cardio léger à modéré",
      description: "Éviter les longues courses à jeun",
      exercises: ["Marche rapide", "Vélo d'appartement", "HIIT doux", "Elliptique"],
      icon: "🏃‍♂️",
      color: "bg-blue-50"
    },
    {
      type: "Mobilité & stretching",
      description: "Parfait pour garder la souplesse",
      exercises: ["Yoga", "Pilates", "Étirements dynamiques", "Foam rolling"],
      icon: "🧘‍♀️",
      color: "bg-purple-50"
    }
  ];

  const nutritionTips = [
    {
      moment: "Après l'iftar",
      recommendations: [
        "Glucides complexes (riz complet, quinoa)",
        "Protéines maigres (poulet, poisson)",
        "Légumes variés",
        "Éviter les aliments gras ou sucrés"
      ],
      color: "bg-green-50"
    },
    {
      moment: "Hydratation",
      recommendations: [
        "1,5L à 2L d'eau entre iftar et suhoor",
        "Boire progressivement",
        "Éviter les boissons sucrées",
        "Privilégier l'eau, thé vert, tisanes"
      ],
      color: "bg-blue-50"
    },
    {
      moment: "Post-entraînement",
      recommendations: [
        "Smoothie protéiné + dattes",
        "Blancs de poulet + patate douce",
        "Fromage blanc + fruits + flocons d'avoine",
        "Récupération dans les 30 minutes"
      ],
      color: "bg-purple-50"
    }
  ];

  const weeklyPlan = [
    { day: "Lundi", time: "Après iftar (21h30)", workout: "Musculation full body", duration: "45 min" },
    { day: "Mercredi", time: "Avant iftar (20h)", workout: "Cardio léger + stretching", duration: "30 min" },
    { day: "Vendredi", time: "Matin (6h)", workout: "Mobilité + gainage", duration: "25 min" },
    { day: "Dimanche", time: "Après iftar", workout: "HIIT doux + renfo abdos", duration: "35 min" }
  ];

  const bbpTips = [
    "Réduisez le volume, pas la qualité",
    "Dormez suffisamment (6-8h)",
    "Adaptez selon votre niveau d'énergie",
    "Planifiez vos séances à l'avance",
    "Soyez indulgent : le mois est spirituel avant tout"
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-900 to-purple-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/4162583/pexels-photo-4162583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour au blog
            </Link>
            
            <div className="mb-4">
              <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Conseils
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              S'entraîner pendant le Ramadan
            </h1>
            
            <p className="text-xl text-purple-100 mb-8 max-w-3xl">
              Conseils pratiques pour maintenir votre routine fitness pendant le mois sacré tout en respectant le jeûne.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>25 février 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>7 min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contenu principal */}
            <article className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {/* Actions sociales */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                        isLiked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likes}</span>
                    </button>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MessageCircle className="h-5 w-5" />
                      <span>15 commentaires</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm mr-2">Partager :</span>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="Partager sur Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                      title="Partager sur Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                      title="Partager sur LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className={`p-2 rounded-full transition-colors ${
                        copied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title="Copier le lien"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Contenu de l'article */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Le mois du Ramadan est une période de spiritualité, de jeûne et de discipline. Mais cela ne signifie pas que votre forme physique doit en pâtir. Avec une bonne organisation, il est tout à fait possible de continuer à s'entraîner tout en respectant le jeûne.
                  </p>

                  {/* Quand s'entraîner */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">⏰</span>
                      Quand s'entraîner pendant le Ramadan ?
                    </h2>
                    
                    <div className="space-y-6">
                      {trainingTimes.map((time, index) => (
                        <div key={index} className={`bg-gradient-to-r ${time.color} rounded-lg p-6 border-l-4 ${time.borderColor}`}>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {index + 1}. {time.time}
                          </h3>
                          <p className="text-gray-700 mb-4">{time.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-800 mb-2">✅ Avantages :</h4>
                              <ul className="space-y-1">
                                {time.pros.map((pro, proIndex) => (
                                  <li key={proIndex} className="text-sm text-gray-700 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Attention :</h4>
                              <ul className="space-y-1">
                                {time.cons.map((con, conIndex) => (
                                  <li key={conIndex} className="text-sm text-gray-700 flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Types d'entraînement */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🏋️</span>
                      Quels types d'entraînement choisir ?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {workoutTypes.map((workout, index) => (
                        <div key={index} className={`${workout.color} rounded-lg p-6`}>
                          <div className="text-center mb-4">
                            <div className="text-4xl mb-2">{workout.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900">{workout.type}</h3>
                          </div>
                          <p className="text-gray-700 text-sm mb-4 text-center">{workout.description}</p>
                          <ul className="space-y-2">
                            {workout.exercises.map((exercise, exerciseIndex) => (
                              <li key={exerciseIndex} className="text-sm text-gray-700 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {exercise}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition & hydratation */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🍽️</span>
                      Nutrition & hydratation
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {nutritionTips.map((tip, index) => (
                        <div key={index} className={`${tip.color} rounded-lg p-6`}>
                          <h3 className="text-lg font-bold text-gray-900 mb-4">{tip.moment}</h3>
                          <ul className="space-y-3">
                            {tip.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="text-sm text-gray-700 flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Astuces BBP */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🧠</span>
                      Astuces BBP Performance
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bbpTips.map((tip, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 flex items-center">
                          <span className="text-purple-600 mr-3 text-xl">💡</span>
                          <span className="text-gray-700 font-medium">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Planning type */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">📌</span>
                      Exemple de planning type
                    </h2>
                    
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Jour</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Moment idéal</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Type de séance</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Durée</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {weeklyPlan.map((day, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{day.day}</td>
                              <td className="px-4 py-3 text-gray-700">{day.time}</td>
                              <td className="px-4 py-3 text-gray-700">{day.workout}</td>
                              <td className="px-4 py-3 text-gray-700">{day.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                      <Moon className="h-8 w-8 mr-3" />
                      Vous ne savez pas comment adapter vos entraînements ?
                    </h3>
                    <p className="mb-6 text-lg">
                      BBP Performance vous propose un programme spécial Ramadan, adapté à votre emploi du temps et à votre niveau d'énergie.
                    </p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2 flex items-center justify-center">
                        <Target className="h-6 w-6 mr-2" />
                        Programme spécial Ramadan
                      </h4>
                      <p className="mb-4">Coaching adapté au jeûne et à vos contraintes !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Réserver votre coaching Ramadan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                {/* Articles similaires */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Articles similaires</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.id}
                        to={`/blog/${article.id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{article.readTime}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Moon className="h-6 w-6 mr-2" />
                    Newsletter Ramadan
                  </h3>
                  <p className="text-indigo-100 mb-4 text-sm">
                    Recevez nos conseils spéciaux pour rester en forme pendant le Ramadan !
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                    >
                      S'abonner
                    </button>
                  </form>
                </div>

                {/* Contact coach */}
                <div className="bg-indigo-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Coach Ibrahim</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert en adaptation d'entraînement et coaching spirituel
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Contacter le coach
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RamadanTrainingArticle;