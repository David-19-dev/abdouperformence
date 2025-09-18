import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle, X, Scale, Target, Zap, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WeightLossMythsArticle: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(156);
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
    const title = "Les mythes de la perte de poids - BBP Performance";
    
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

  const myths = [
    {
      id: 1,
      myth: "Il faut arrêter de manger pour maigrir",
      reality: "Le corps a besoin d'énergie pour fonctionner. Se priver de nourriture ralentit le métabolisme, fatigue le corps et provoque l'effet yoyo.",
      action: "Manger mieux, pas moins.",
      color: "from-red-50 to-pink-50",
      borderColor: "border-red-500"
    },
    {
      id: 2,
      myth: "Les glucides font grossir",
      reality: "Les glucides sont essentiels à l'énergie. Ce sont surtout les glucides raffinés (pains blancs, sodas, gâteaux) qui posent problème.",
      action: "Préférez : riz complet, patate douce, flocons d'avoine.",
      color: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-500"
    },
    {
      id: 3,
      myth: "Il faut faire uniquement du cardio",
      reality: "Le cardio brûle des calories, mais la musculation augmente le métabolisme de repos (vous brûlez même en dormant).",
      action: "Combinez cardio + renforcement musculaire.",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-500"
    },
    {
      id: 4,
      myth: "Les compléments brûle-graisse suffisent",
      reality: "Aucun complément ne remplace une bonne alimentation + sport régulier. Ils peuvent être un petit coup de pouce, mais pas une solution magique.",
      action: "Priorisez un mode de vie sain.",
      color: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-500"
    },
    {
      id: 5,
      myth: "Il faut éviter de manger le soir",
      reality: "Ce qui compte, c'est l'apport calorique total sur la journée, pas l'heure des repas.",
      action: "Mangez léger le soir si vous êtes sédentaire, mais ne sautez pas le dîner.",
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-500"
    },
    {
      id: 6,
      myth: "Il faut perdre du poids pour être en forme",
      reality: "Perdre du poids n'est pas toujours synonyme de bonne santé. On peut être mince mais en mauvaise santé, ou musclé et en forme sans être maigre.",
      action: "Cherchez à être en forme, pas juste à maigrir.",
      color: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-500"
    }
  ];

  const truthTable = [
    { belief: "Manger peu = perte de poids", reality: "Faux – Il faut un bon équilibre" },
    { belief: "Supprimer les glucides", reality: "Faux – Il faut choisir les bons" },
    { belief: "Cardio seul suffit", reality: "Faux – La musculation est essentielle" },
    { belief: "Compléments = solution miracle", reality: "Faux – Ils n'agissent que si le mode de vie est sain" },
    { belief: "Ne pas manger le soir", reality: "Pas toujours vrai – Ça dépend du rythme de vie" }
  ];

  const recommendations = [
    "Mangez équilibré (protéines, bons lipides, bons glucides)",
    "Dormez suffisamment",
    "Bougez régulièrement (muscu + cardio)",
    "Fixez-vous des objectifs réalistes",
    "Faites-vous accompagner si besoin"
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-red-900 to-orange-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
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
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Perte de poids
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Les mythes de la perte de poids
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 max-w-3xl">
              Démystifions ensemble les croyances les plus courantes qui peuvent freiner vos progrès ou nuire à votre santé.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>1 mars 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>6 min de lecture</span>
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
                      <span>12 commentaires</span>
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
                    La perte de poids est l'un des objectifs les plus populaires en matière de fitness, mais elle est aussi entourée de nombreux mythes et idées reçues. Ces fausses croyances peuvent freiner vos progrès, ou pire, nuire à votre santé. Dans cet article, BBP Performance vous aide à faire le tri entre ce qui est vrai, faux… et ce qu'il faut vraiment retenir.
                  </p>

                  {/* Introduction avec alerte */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-xl font-bold text-red-800">Attention aux idées reçues !</h3>
                    </div>
                    <p className="text-red-700">
                      Les mythes sur la perte de poids peuvent non seulement ralentir vos progrès, mais aussi mettre votre santé en danger. Apprenons à distinguer le vrai du faux.
                    </p>
                  </div>

                  {/* Mythes */}
                  {myths.map((myth, index) => (
                    <div key={myth.id} className={`bg-gradient-to-r ${myth.color} rounded-xl p-6 mb-8`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-3xl mr-3">❌</span>
                        Mythe {index + 1} : « {myth.myth} »
                      </h2>
                      
                      <div className="mb-6">
                        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                          <h4 className="font-bold text-red-600 mb-2">🚫 Faux.</h4>
                          <p className="text-gray-700">{myth.reality}</p>
                        </div>
                      </div>

                      <div className={`bg-white rounded-lg p-4 border-l-4 ${myth.borderColor}`}>
                        <p className="text-gray-800 font-medium">
                          <span className="font-bold text-green-600">➡️ Ce qu'il faut faire :</span> {myth.action}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Tableau de vérité */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">✅</span>
                      Ce qu'il faut retenir
                    </h2>
                    
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Croyance</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Réalité</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {truthTable.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{row.belief}</td>
                              <td className="px-4 py-3 font-medium text-red-600">{row.reality}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recommandations BBP */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🧠</span>
                      BBP vous conseille :
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                          <span className="text-green-500 mr-3">✅</span>
                          <span className="text-gray-700 font-medium">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-red-900 to-orange-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                      <Scale className="h-8 w-8 mr-3" />
                      Envie de perdre du poids sainement ?
                    </h3>
                    <p className="mb-6 text-lg">
                      BBP Performance vous accompagne avec un coaching nutritionnel + sportif personnalisé.
                    </p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2 flex items-center justify-center">
                        <Target className="h-6 w-6 mr-2" />
                        Coaching perte de poids personnalisé
                      </h4>
                      <p className="mb-4">Perdez du poids durablement avec un accompagnement professionnel !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Contactez-nous dès maintenant !
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
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Scale className="h-6 w-6 mr-2" />
                    Newsletter Perte de Poids
                  </h3>
                  <p className="text-red-100 mb-4 text-sm">
                    Recevez nos meilleurs conseils pour perdre du poids sainement !
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-red-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                    >
                      S'abonner
                    </button>
                  </form>
                </div>

                {/* Contact coach */}
                <div className="bg-red-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Coach Ibrahim</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert en perte de poids et transformation physique
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
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

export default WeightLossMythsArticle;