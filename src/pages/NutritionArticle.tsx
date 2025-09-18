import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NutritionArticle: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(189);
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
    const title = "Les bases d'une nutrition pré et post-entraînement - BBP Performance";
    
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
      id: 3,
      title: "Guide complet des exercices de musculation",
      image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "12 min"
    },
    {
      id: 4,
      title: "Les mythes de la perte de poids",
      image: "https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: "6 min"
    }
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-green-900 to-blue-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
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
                Nutrition
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Les bases d'une nutrition pré et post-entraînement
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl">
              Tout ce que vous devez savoir sur l'alimentation avant et après votre séance pour maximiser vos résultats.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>10 mars 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>8 min de lecture</span>
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
                      <span>18 commentaires</span>
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
                    Une bonne nutrition autour de l'entraînement, c'est la clé pour progresser, éviter les blessures et améliorer ses performances. Voici ce que vous devez absolument savoir pour bien vous alimenter avant et après vos séances.
                  </p>

                  {/* Section Pré-entraînement */}
                  <div className="bg-orange-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">⏰</span>
                      Avant l'entraînement : carburant pour vos muscles
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Votre corps a besoin d'énergie pour performer. Un bon repas ou snack pré-entraînement prépare vos muscles à l'effort et évite les coups de fatigue.
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h3 className="font-bold text-orange-800 mb-3">✅ Objectifs :</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                          <span>Fournir de l'énergie (glucides)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                          <span>Préserver la masse musculaire (protéines)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                          <span>Éviter les troubles digestifs</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                        <span className="text-2xl mr-2">🍌</span>
                        Que manger 1 à 2h avant ?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Riz complet + poulet + légumes cuits',
                          'Flocons d\'avoine + lait végétal + banane',
                          'Pain complet + œufs durs',
                          'Smoothie protéiné + fruits rouges'
                        ].map((meal, index) => (
                          <div key={index} className="flex items-center bg-orange-50 rounded-lg p-3">
                            <span className="text-orange-600 mr-2">🍽️</span>
                            <span className="text-sm">{meal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-100 rounded-lg p-4 mt-4 border-l-4 border-yellow-500">
                      <p className="text-yellow-800 font-medium">
                        <span className="font-bold">🕒</span> Si vous vous entraînez tôt le matin, un petit encas 30 min avant peut suffire (banane + poignée d'amandes, par exemple).
                      </p>
                    </div>
                  </div>

                  {/* Section Hydratation */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🧃</span>
                      Hydratation : ne l'oubliez jamais
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Boire de l'eau avant, pendant et après l'effort permet d'éviter la fatigue, les crampes et d'améliorer les performances.
                    </p>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-blue-800 font-medium">
                        <span className="font-bold">💧</span> Buvez un grand verre d'eau 30 minutes avant la séance et hydratez-vous régulièrement pendant l'effort.
                      </p>
                    </div>
                  </div>

                  {/* Section Post-entraînement */}
                  <div className="bg-green-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🏋️</span>
                      Après l'entraînement : reconstruire et récupérer
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Après une séance, votre corps est en mode "réparation". Il faut lui fournir les bons nutriments pour reconstruire les fibres musculaires et recharger les réserves d'énergie.
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h3 className="font-bold text-green-800 mb-3">✅ Objectifs :</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <span>Favoriser la récupération musculaire (protéines)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <span>Reconstituer les réserves de glycogène (glucides)</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <span>Réduire la fatigue et l'inflammation</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h3 className="font-bold text-green-800 mb-3 flex items-center">
                        <span className="text-2xl mr-2">🍽️</span>
                        Idées de repas post-entraînement :
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Riz + filet de saumon + légumes vapeur',
                          'Patate douce + œufs brouillés + avocat',
                          'Wrap au poulet + crudités + houmous',
                          'Shake protéiné + flocons d\'avoine + lait végétal'
                        ].map((meal, index) => (
                          <div key={index} className="flex items-center bg-green-50 rounded-lg p-3">
                            <span className="text-green-600 mr-2">🥗</span>
                            <span className="text-sm">{meal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-green-800 font-medium">
                        <span className="font-bold">⏳</span> Idéalement, mangez dans les 30 à 60 minutes après votre séance pour maximiser les bénéfices.
                      </p>
                    </div>
                  </div>

                  {/* Section Équilibre global */}
                  <div className="bg-purple-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🔄</span>
                      L'équilibre sur toute la journée compte aussi
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Bien manger avant et après l'entraînement ne suffit pas si le reste de vos repas est déséquilibré.
                    </p>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-bold text-purple-800 mb-3">Pensez à :</h3>
                      <div className="space-y-3">
                        <div className="flex items-center bg-purple-50 rounded-lg p-3">
                          <span className="text-purple-600 mr-3">💪</span>
                          <span>Consommer suffisamment de protéines (1,5 à 2g/kg de poids corporel)</span>
                        </div>
                        <div className="flex items-center bg-purple-50 rounded-lg p-3">
                          <span className="text-purple-600 mr-3">🌾</span>
                          <span>Choisir des glucides complexes</span>
                        </div>
                        <div className="flex items-center bg-purple-50 rounded-lg p-3">
                          <span className="text-purple-600 mr-3">🥑</span>
                          <span>Ne pas négliger les bons lipides (oméga 3)</span>
                        </div>
                        <div className="flex items-center bg-purple-50 rounded-lg p-3">
                          <span className="text-purple-600 mr-3">🥕</span>
                          <span>Varier vos sources de vitamines et minéraux (fruits, légumes, oléagineux)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Résumé */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🎯</span>
                      En résumé :
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">⏰</div>
                        <h4 className="font-bold text-blue-800 mb-2">Avant</h4>
                        <p className="text-sm text-gray-700">Énergie → glucides + un peu de protéines</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">🏋️</div>
                        <h4 className="font-bold text-green-800 mb-2">Après</h4>
                        <p className="text-sm text-gray-700">Récupération → protéines + glucides</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">💧</div>
                        <h4 className="font-bold text-purple-800 mb-2">Toujours</h4>
                        <p className="text-sm text-gray-700">Hydratation + équilibre alimentaire</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-green-900 to-blue-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">💬 Vous avez encore des doutes sur quoi manger selon votre objectif ?</h3>
                    <p className="mb-6">Prise de masse, sèche, performance... Contactez notre équipe BBP Performance pour un coaching nutrition personnalisé !</p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2">🍎 Coaching nutritionnel personnalisé</h4>
                      <p className="mb-4">Nos experts vous accompagnent pour optimiser votre alimentation selon vos objectifs !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Réserver un coaching nutritionnel
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
                  <h3 className="text-xl font-bold mb-3">🥗 Newsletter Nutrition</h3>
                  <p className="text-green-100 mb-4 text-sm">
                    Recevez nos meilleurs conseils nutrition et recettes fitness !
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
                      Expert en nutrition sportive et performance
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

export default NutritionArticle;