import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBlogPosts } from '../lib/firestore';

const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(247);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    if (!slug) {
      console.log('❌ No slug provided in URL');
      return;
    }

    console.log('🔍 Fetching article with slug:', slug);

    try {
      setLoading(true);
      setError(null);
      const posts = await getBlogPosts();

      console.log('📋 All posts fetched:', posts.length);
      console.log('📋 Posts data:', posts.map(p => ({ id: p.id, slug: (p as any).slug, title: (p as any).title })));

      const foundArticle = posts.find((post: any) => post.slug === slug);

      console.log('🎯 Found article:', foundArticle ? { id: foundArticle.id, slug: (foundArticle as any).slug, title: (foundArticle as any).title } : 'NOT FOUND');

      if (foundArticle) {
        setArticle(foundArticle);
        // Reset like state for new article
        setIsLiked(false);
        setLikes(247); // You might want to store this in Firestore too
        console.log('✅ Article loaded successfully:', (foundArticle as any).title);
      } else {
        console.log('❌ Article not found for slug:', slug);
        setError('Article non trouvé');
      }
    } catch (err) {
      console.error('❌ Error fetching article:', err);
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    if (!isLiked) {
      toast.success('Article ajouté aux favoris !');
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article ? `${article.title} - BBP Performance` : "BBP Performance";

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

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || 'L\'article demandé n\'existe pas.'}</p>
          <Link
            to="/blog"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Retour au blog
          </Link>
        </div>
      </main>
    );
  }

  const [relatedArticles, setRelatedArticles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!article || !article.category) {
        setRelatedArticles([]);
        return;
      }
      try {
        const posts = await getBlogPosts();
        // Filter posts by same category, exclude current article
        const related = posts.filter((post: any) => post.category === article.category && post.slug !== article.slug);
        setRelatedArticles(related.slice(0, 3)); // Limit to 3 related articles
      } catch (error) {
        console.error('Error fetching related articles:', error);
        setRelatedArticles([]);
      }
    };
    fetchRelatedArticles();
  }, [article]);

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Header avec image hero */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-red-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('${article.image || "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}')`
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
                Récupération
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Comment optimiser sa récupération musculaire
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl">
              Découvrez les meilleures techniques pour récupérer efficacement après vos séances d'entraînement intensif.
            </p>
            
            <div className="flex items-center text-white/80 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Coach Ibrahim</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>15 mars 2024</span>
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
                      <span>23 commentaires</span>
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
                    Après un entraînement intense, la récupération musculaire est aussi importante que l'entraînement lui-même. Sans une bonne récupération, le risque de blessures, de fatigue chronique ou de stagnation de vos performances augmente. Voici les meilleures méthodes pour optimiser votre récupération.
                  </p>

                  {/* Section 1 */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🧘</span>
                      1. Le repos, la base de tout
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Le sommeil est le moment où le corps reconstruit les fibres musculaires. Dormir entre 7 et 9 heures par nuit permet une sécrétion optimale d'hormones de croissance.
                    </p>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-blue-800 font-medium">
                        <span className="font-bold">🛌 Conseil :</span> Dormez dans un environnement frais, sombre et sans écran pour maximiser la qualité de votre sommeil.
                      </p>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="bg-cyan-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🥤</span>
                      2. L'hydratation, souvent négligée
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Boire suffisamment d'eau permet d'éliminer les toxines produites durant l'effort et d'éviter les crampes musculaires.
                    </p>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-cyan-500">
                      <p className="text-cyan-800 font-medium">
                        <span className="font-bold">💧</span> Buvez au minimum 1,5 à 2 L d'eau par jour. Ajoutez une pincée de sel ou du citron pour favoriser l'absorption après l'effort.
                      </p>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="bg-green-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🥗</span>
                      3. Une alimentation riche et équilibrée
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Les protéines, les glucides et les bons lipides sont essentiels pour reconstruire le muscle.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <h4 className="font-bold text-green-800 mb-2">Protéines</h4>
                        <p className="text-sm text-gray-600">Pour réparer les fibres</p>
                        <p className="text-xs text-gray-500 mt-1">(œufs, viande maigre, tofu)</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <h4 className="font-bold text-green-800 mb-2">Glucides</h4>
                        <p className="text-sm text-gray-600">Pour recharger l'énergie</p>
                        <p className="text-xs text-gray-500 mt-1">(riz, patate douce)</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <h4 className="font-bold text-green-800 mb-2">Lipides</h4>
                        <p className="text-sm text-gray-600">Pour les hormones</p>
                        <p className="text-xs text-gray-500 mt-1">(avocat, huile d'olive)</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-green-800 font-medium">
                        <span className="font-bold">🍽️</span> Pensez à un repas riche en protéines dans les 30 à 60 minutes suivant l'entraînement.
                      </p>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="bg-purple-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🧊</span>
                      4. Le froid et la chaleur : vos alliés
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-bold text-blue-600 mb-2">❄️ Bain froid / cryothérapie</h4>
                        <p className="text-sm text-gray-600">Réduit l'inflammation et les douleurs musculaires</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-bold text-red-600 mb-2">🔥 Douche chaude / sauna</h4>
                        <p className="text-sm text-gray-600">Détend les muscles et améliore la circulation</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                      <p className="text-purple-800 font-medium">
                        <span className="font-bold">🛁</span> Alternez chaud / froid pour un effet de "pompage\" sanguin accélérant la récupération.
                      </p>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="bg-orange-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🤲</span>
                      5. Étirements & automassages
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Les étirements passifs ou les rouleaux de massage (foam roller) aident à détendre les muscles et à prévenir les courbatures.
                    </p>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <p className="text-orange-800 font-medium">
                        <span className="font-bold">📌</span> 10 minutes d'étirements légers après chaque séance suffisent pour améliorer la souplesse et éviter les blessures.
                      </p>
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div className="bg-yellow-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">💊</span>
                      6. Les compléments (optionnels mais utiles)
                    </h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-white rounded-lg p-3 flex items-center">
                        <span className="font-bold text-yellow-600 mr-3">Magnésium :</span>
                        <span className="text-gray-700">réduit les crampes et favorise la détente</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 flex items-center">
                        <span className="font-bold text-yellow-600 mr-3">BCAA :</span>
                        <span className="text-gray-700">utiles pour les longues séances à jeun</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 flex items-center">
                        <span className="font-bold text-yellow-600 mr-3">ZMA / oméga 3 :</span>
                        <span className="text-gray-700">optimisent la récupération et le sommeil</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                      <p className="text-yellow-800 font-medium">
                        <span className="font-bold">🧪</span> Consultez toujours un professionnel avant de prendre des compléments.
                      </p>
                    </div>
                  </div>

                  {/* Résumé */}
                  <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🎯</span>
                      En résumé :
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Dormez suffisamment',
                        'Mangez équilibré',
                        'Hydratez-vous',
                        'Alternez chaud/froid',
                        'Étirez-vous',
                        'Utilisez des compléments si besoin'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center bg-white rounded-lg p-3">
                          <span className="text-green-500 mr-3">✅</span>
                          <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-blue-900 to-red-800 rounded-xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">💬 Et vous, quelle est votre technique de récupération préférée ?</h3>
                    <p className="mb-6">Dites-le-nous en commentaire ou par message !</p>
                    
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-bold mb-2">🔗 Besoin d'un accompagnement personnalisé ?</h4>
                      <p className="mb-4">Nos coachs BBP Performance sont là pour vous aider !</p>
                      <Link
                        to="/booking"
                        className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        👉 Réservez une séance avec un coach
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
                        to={`/blog/${article.slug}`}
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
                  <h3 className="text-xl font-bold mb-3">📧 Newsletter</h3>
                  <p className="text-red-100 mb-4 text-sm">
                    Recevez nos meilleurs conseils fitness directement dans votre boîte mail !
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
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Coach Ibrahim</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Expert en récupération et performance sportive
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
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

export default BlogArticle;