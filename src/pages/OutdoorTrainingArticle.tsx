import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle, Sun, Trees, Wind, Zap, Target, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OutdoorTrainingArticle: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(134);
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
    const title = "Les bienfaits de l'entraînement en plein air - BBP Performance";
    
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

  const benefits = [
    {
      id: 1,
      title: "Une meilleure oxygénation",
      description: "S'entraîner dehors, c'est respirer de l'air plus pur (loin des climatisations de salle).",
      benefit: "Votre corps s'oxygène mieux, votre cœur travaille plus efficacement, et vous récupérez plus vite.",
      icon: <Wind className="h-8 w-8 text-blue-600" />,
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-500"
    },
    {
      id: 2,
      title: "Un boost mental",
      description: "L'exposition à la lumière naturelle stimule la production de sérotonine (l'hormone du bonheur).",
      benefits: [
        "Moins de stress",
        "Plus de motivation", 
        "Un moral au top pour tenir sur la durée"
      ],
      icon: <Smile className="h-8 w-8 text-yellow-600" />,
      color: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-500"
    },
    {
      id: 3,
      title: "Une dépense calorique plus importante",
      description: "Le sol instable, le vent, les variations de terrain... Tout ça recrute plus de muscles stabilisateurs et augmente naturellement l'intensité de votre séance.",
      benefit: "À effort égal, vous brûlez plus de calories qu'en salle !",
      icon: <Zap className="h-8 w-8 text-red-600" />,
      color: "from-red-50 to-pink-50",
      borderColor: "border-red-500"
    },
    {
      id: 4,
      title: "Des entraînements variés et ludiques",
      description: "Parc, forêt, plage, stade... chaque endroit offre de nouvelles possibilités :",
      activities: [
        "Sprints sur herbe",
        "Pompes sur un banc",
        "Circuit training au poids du corps",
        "Abdos face au soleil"
      ],
      benefit: "Plus de routine = plus d'adhésion à long terme.",
      icon: <Trees className="h-8 w-8 text-green-600" />,
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-500"
    },
    {
      id: 5,
      title: "C'est 100% gratuit !",
      description: "Pas d'abonnement, pas de file d'attente pour une machine.",
      benefit: "L'extérieur est votre salle de sport illimitée... et gratuite !",
      icon: <Target className="h-8 w-8 text-purple-600" />,
      color: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-500"
    }
  ];

  const circuitExercises = [
    { name: "10 squats jump", icon: "🦵" },
    { name: "10 pompes", icon: "💪" },
    { name: "30 secondes de mountain climbers", icon: "🏃‍♂️" },
    { name: "10 fentes par jambe", icon: "🦵" },
    { name: "10 burpees", icon: "🔥" },
    { name: "30 sec de planche", icon: "💥" }
  ];

  const tips = [
    {
      tip: "En été : privilégiez les séances tôt le matin ou en fin de journée",
      icon: "🕶️"
    },
    {
      tip: "Hydratez-vous bien avant, pendant et après",
      icon: "💧"
    },
    {
      tip: "Portez des chaussures adaptées au sol (bitume, sable, herbe)",
      icon: "👟"
    },
    {
      tip: "Faites-vous une playlist motivante ou entraînez-vous avec un ami",
      icon: "🎧"
    },
    {
      tip: "N'oubliez pas la crème solaire si vous vous exposez longtemps !",
      icon: "☀️"
    }
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-green-900 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
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
              <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Lifestyle
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Les bienfaits de l'entraînement en plein air
            </h1>
            
            <p className="text-xl text-green-100 mb-8 max-w-3xl">
              Découvrez pourquoi s'entraîner en extérieur peut booster vos résultats et transformer votre approche du fitness.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>20 février 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>5 min de lecture</span>
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
                      <span>21 commentaires</span>
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
                    Vous êtes fatigué de la salle de sport fermée, du tapis roulant sans fin et de l'air conditionné ? 
                    Il est peut-être temps d'emmener vos entraînements dehors. Chez BBP Performance, on vous explique 
                    pourquoi l'entraînement en plein air est bien plus qu'une alternative : c'est un booster naturel 
                    de motivation, d'énergie… et de résultats !
                  </p>

                  {/* Bienfaits */}
                  {benefits.map((benefit, index) => (
                    <div key={benefit.id} className={`bg-gradient-to-r ${benefit.color} rounded-xl p-6 mb-8`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-3xl mr-3">🌞</span>
                        {index + 1}. {benefit.title}
                      </h2>
                      
                      <div className="mb-6">
                        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                          <div className="flex items-start">
                            <div className="mr-4 mt-1">
                              {benefit.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 mb-3">{benefit.description}</p>
                              
                              {benefit.benefits && (
                                <div className="space-y-2">
                                  <p className="font-medium text-gray-800">Résultat :</p>
                                  <ul className="space-y-1">
                                    {benefit.benefits.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                                        <span className="text-green-500 mr-2">✅</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {benefit.activities && (
                                <div className="space-y-2">
                                  <ul className="space-y-1">
                                    {benefit.activities.map((activity, actIndex) => (
                                      <li key={actIndex} className="flex items-center text-sm text-gray-700">
                                        <span className="text-green-500 mr-2">✅</span>
                                        {activity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {benefit.benefit && (
                                <p className="text-gray-800 font-medium mt-3">
                                  ➤ {benefit.benefit}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Circuit outdoor */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">📌</span>
                      Exemple de circuit outdoor complet (30 min)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {circuitExercises.map((exercise, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 flex items-center shadow-sm">
                          <span className="text-2xl mr-3">{exercise.icon}</span>
                          <span className="font-medium text-gray-900">{exercise.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <p className="text-orange-800 font-medium">
                        <span className="font-bold">🔁</span> À répéter 3 à 4 fois avec 1 min de pause entre les tours
                      </p>
                    </div>
                  </div>

                  {/* Conseils BBP */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🧠</span>
                      Conseils BBP Performance
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tips.map((tip, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 flex items-start shadow-sm">
                          <span className="text-xl mr-3 mt-1">{tip.icon}</span>
                          <span className="text-gray-700">{tip.tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-green-900 to-blue-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                      <Trees className="h-8 w-8 mr-3" />
                      Envie de transformer un parc en salle de sport personnalisée ?
                    </h3>
                    <p className="mb-6 text-lg">
                      BBP Performance propose des séances de coaching en plein air, individuelles ou en petit groupe, 
                      dans plusieurs quartiers de Dakar.
                    </p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2 flex items-center justify-center">
                        <Sun className="h-6 w-6 mr-2" />
                        Coaching outdoor personnalisé
                      </h4>
                      <p className="mb-4">Profitez de la nature pour vos entraînements !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Réserver une séance découverte
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
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Trees className="h-6 w-6 mr-2" />
                    Newsletter Outdoor
                  </h3>
                  <p className="text-green-100 mb-4 text-sm">
                    Recevez nos meilleurs conseils pour vous entraîner en plein air !
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                    >
                      S'abonner
                    </button>
                  </form>
                </div>

                {/* Contact coach */}
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Coach Ibrahim</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert en entraînement outdoor et coaching en plein air
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
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

export default OutdoorTrainingArticle;