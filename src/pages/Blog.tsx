import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { getBlogPosts } from '../lib/firestore';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const posts = await getBlogPosts();
      // Map Firestore data to component format
      const mappedArticles = posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        image: post.imageUrl,
        category: post.category,
        author: post.author,
        date: post.publishedAt?.toDate ? post.publishedAt.toDate().toISOString().split('T')[0] : post.publishedAt,
        readTime: post.readTime,
        featured: post.featured,
        slug: post.slug
      }));
      setArticles(mappedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

const categories = [
  "Tous",
  "Musculation",
  "Nutrition",
  "Récupération",
  "Perte de poids",
  "Lifestyle",
  "Conseils"
];

  // Loading state
  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
      </section>
    );
  }
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-red-600 font-semibold uppercase tracking-wider">Blog</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">Conseils & Actualités Fitness</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Découvrez nos derniers articles sur la musculation, la nutrition et le bien-être pour optimiser vos résultats.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-8">
          {categories.slice(0, 5).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {filteredArticles
            .filter(article => article.featured)
            .slice(0, 2)
            .map(article => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <User size={14} className="mr-1" />
                    <span className="mr-4">{article.author}</span>
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-4">{formatDate(article.date)}</span>
                    <Clock size={14} className="mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="text-red-600 font-medium inline-flex items-center group/btn text-sm"
                  >
                    Lire la suite
                    <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles
            .filter(article => !article.featured)
            .slice(0, 3)
            .map(article => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-4">{formatDate(article.date)}</span>
                    <Clock size={14} className="mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{article.excerpt}</p>
                  <button className="text-red-600 font-medium inline-flex items-center group/btn">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="text-red-600 font-medium inline-flex items-center group/btn text-xs"
                      >
                        Lire la suite
                        <ArrowRight size={12} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-10 bg-blue-900 text-white rounded-lg p-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">
              Restez informé des dernières actualités fitness
            </h3>
            <p className="text-blue-100 mb-4 text-sm">
              Inscrivez-vous à notre newsletter pour recevoir nos meilleurs conseils et actualités directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
              >
                S'abonner
                <ArrowRight size={14} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;