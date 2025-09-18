import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle, Dumbbell, Target, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MuscleGuideArticle: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(312);
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
    const title = "Guide complet des exercices de musculation - BBP Performance";
    
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
      id: 4,
      title: "Les mythes de la perte de poids",
      image: "https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "6 min"
    }
  ];

  const muscleGroups = [
    {
      name: "Pectoraux",
      icon: "🫀",
      color: "from-red-50 to-pink-50",
      borderColor: "border-red-500",
      exercises: [
        { name: "Développé couché", benefit: "Idéal pour la masse musculaire" },
        { name: "Développé incliné", benefit: "Pour cibler le haut des pectoraux" },
        { name: "Pompes", benefit: "Variante au poids du corps très efficace" },
        { name: "Écarté couché / incliné", benefit: "Pour étirer et isoler le muscle" }
      ],
      tip: "Variez les angles pour un développement complet."
    },
    {
      name: "Dos",
      icon: "💪",
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-500",
      exercises: [
        { name: "Tractions (pronation)", benefit: "Excellent pour le dos large et fort" },
        { name: "Rowing barre ou haltères", benefit: "Cible le milieu du dos" },
        { name: "Tirage vertical / horizontal", benefit: "Très bon pour contrôler le mouvement" },
        { name: "Soulevé de terre", benefit: "Recrute toute la chaîne postérieure" }
      ],
      tip: "Gardez toujours le dos droit pour éviter les blessures."
    },
    {
      name: "Jambes",
      icon: "🦵",
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-500",
      exercises: [
        { name: "Squat (libre ou guidé)", benefit: "Roi des exercices pour les jambes" },
        { name: "Fentes (avant ou marchées)", benefit: "Pour renforcer quadriceps et fessiers" },
        { name: "Presse à jambes", benefit: "Alternative plus stable au squat" },
        { name: "Leg curl / Leg extension", benefit: "Pour isoler ischios et quadriceps" }
      ],
      tip: "Travaillez les deux jambes de façon équilibrée."
    },
    {
      name: "Épaules",
      icon: "💪",
      color: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-500",
      exercises: [
        { name: "Développé militaire", benefit: "Cible les deltoïdes antérieurs" },
        { name: "Élévations latérales", benefit: "Pour élargir les épaules" },
        { name: "Oiseau / Reverse fly", benefit: "Pour les deltoïdes postérieurs" },
        { name: "Arnold Press", benefit: "Mouvement complet pour toutes les portions" }
      ],
      tip: "Ne négligez pas l'arrière des épaules pour éviter les déséquilibres."
    }
  ];

  const armExercises = {
    biceps: [
      { name: "Curl barre / haltères", benefit: "Classique mais redoutable" },
      { name: "Curl incliné", benefit: "Étire le biceps pour plus d'efficacité" },
      { name: "Curl marteau", benefit: "Travaille aussi le brachial" }
    ],
    triceps: [
      { name: "Dips", benefit: "Très complet, au poids du corps" },
      { name: "Extensions à la poulie", benefit: "Ciblage précis" },
      { name: "Barre front / Skullcrusher", benefit: "Excellent pour prendre en masse" }
    ]
  };

  const coreExercises = [
    "Gainage (plank)",
    "Crunchs / Crunchs inversés",
    "Relevé de jambes",
    "Russian twist",
    "Mountain climbers"
  ];

  const summaryTable = [
    { muscle: "Pectoraux", exercise: "Développé couché", icon: "🫀" },
    { muscle: "Dos", exercise: "Tractions", icon: "💪" },
    { muscle: "Jambes", exercise: "Squat", icon: "🦵" },
    { muscle: "Épaules", exercise: "Développé militaire", icon: "💪" },
    { muscle: "Biceps", exercise: "Curl barre", icon: "💪" },
    { muscle: "Triceps", exercise: "Dips", icon: "💪" },
    { muscle: "Abdos", exercise: "Gainage", icon: "💥" }
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-purple-900 to-indigo-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
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
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Musculation
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Guide complet des exercices de musculation
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl">
              Un guide détaillé des exercices fondamentaux pour chaque groupe musculaire, que vous soyez débutant ou confirmé.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>5 mars 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>12 min de lecture</span>
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
                      <span>28 commentaires</span>
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
                    Que vous soyez débutant ou confirmé, connaître les exercices de base pour chaque groupe musculaire est essentiel pour construire un programme efficace, équilibré et durable. Ce guide vous présente les meilleurs exercices de musculation classés par zone musculaire, avec des conseils pour bien les exécuter.
                  </p>

                  {/* Groupes musculaires principaux */}
                  {muscleGroups.map((group, index) => (
                    <div key={index} className={`bg-gradient-to-r ${group.color} rounded-xl p-6 mb-8`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-3xl mr-3">{group.icon}</span>
                        {index + 1}. {group.name}
                      </h2>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">🔹 Exercices de base :</h3>
                        <div className="space-y-3">
                          {group.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{exercise.name}</h4>
                                  <p className="text-sm text-gray-600">➤ {exercise.benefit}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`bg-white rounded-lg p-4 border-l-4 ${group.borderColor}`}>
                        <p className="text-gray-800 font-medium">
                          <span className="font-bold">💡 Astuce :</span> {group.tip}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Section Bras */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">💪</span>
                      5. Bras (Biceps & Triceps)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-800">🔸 Biceps :</h3>
                        <div className="space-y-3">
                          {armExercises.biceps.map((exercise, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{exercise.name}</h4>
                              <p className="text-xs text-gray-600">➤ {exercise.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-800">🔸 Triceps :</h3>
                        <div className="space-y-3">
                          {armExercises.triceps.map((exercise, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{exercise.name}</h4>
                              <p className="text-xs text-gray-600">➤ {exercise.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <p className="text-orange-800 font-medium">
                        <span className="font-bold">💡 Astuce :</span> Pour des bras équilibrés, consacrez autant de temps aux triceps qu'aux biceps (ils représentent 2/3 du bras !).
                      </p>
                    </div>
                  </div>

                  {/* Section Bonus Abdos */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">💥</span>
                      Bonus : Abdos & Core
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {coreExercises.map((exercise, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                          <span className="text-gray-600 mr-3">•</span>
                          <span className="font-medium text-gray-900">{exercise}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-gray-500">
                      <p className="text-gray-800 font-medium">
                        <span className="font-bold">💡 Astuce :</span> Travaillez les abdos en fin de séance ou en circuit pour plus de résultats.
                      </p>
                    </div>
                  </div>

                  {/* Tableau récapitulatif */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">📌</span>
                      En résumé
                    </h2>
                    
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Groupe Musculaire</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Top Exercice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {summaryTable.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 flex items-center">
                                <span className="text-xl mr-2">{row.icon}</span>
                                <span className="font-medium text-gray-900">{row.muscle}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{row.exercise}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                      <Dumbbell className="h-8 w-8 mr-3" />
                      Vous voulez un programme personnalisé ?
                    </h3>
                    <p className="mb-6 text-lg">
                      Obtenez un programme sur-mesure avec ces exercices, selon votre objectif (prise de masse, sèche, tonification) !
                    </p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2 flex items-center justify-center">
                        <Target className="h-6 w-6 mr-2" />
                        Coaching personnalisé BBP Performance
                      </h4>
                      <p className="mb-4">Programmes adaptés à votre niveau et vos objectifs !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Réserver un coaching sur-mesure
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
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Dumbbell className="h-6 w-6 mr-2" />
                    Newsletter Musculation
                  </h3>
                  <p className="text-purple-100 mb-4 text-sm">
                    Recevez nos meilleurs programmes et conseils d'entraînement !
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                    >
                      S'abonner
                    </button>
                  </form>
                </div>

                {/* Contact coach */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Coach Ibrahim</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert en musculation et développement musculaire
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
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

export default MuscleGuideArticle;