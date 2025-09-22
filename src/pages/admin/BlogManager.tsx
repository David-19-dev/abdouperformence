import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, X, Calendar, Clock, Tag, User, Eye, ArrowRight } from 'lucide-react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostBySlug, BlogPost as BlogPostType } from '../../lib/firestore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

type BlogPost = BlogPostType;

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: '',
    author: 'Coach Ibrahim',
    readTime: '5 min',
    featured: false,
    slug: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const posts = await getBlogPosts();
      console.log('Fetched posts:', posts);
      if (posts && posts.length > 0) {
        setPosts(posts as BlogPost[]);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };
  
  console.log('Current posts state:', posts);
  console.log('Current searchTerm:', searchTerm);
  
  // Remove duplicate declaration of filteredPosts
  // const filteredPosts = posts.filter(post => {
  //   const title = post.title || '';
  //   const excerpt = post.excerpt || '';
  //   const category = post.category || '';
  //   return (
  //     title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     category.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // });
  
  // console.log('Filtered posts:', filteredPosts);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // Ensure unique slug by checking Firestore and appending -2, -3, ... if needed
  const ensureUniqueSlug = async (baseSlug: string, excludeId?: string) => {
    let candidate = baseSlug;
    let suffix = 2;
    while (true) {
      const existing = await getBlogPostBySlug(candidate);
      if (!existing || (excludeId && existing.id === excludeId)) {
        return candidate;
      }
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Validate/normalize slug and ensure uniqueness
      const baseSlug = generateSlug(formData.slug || formData.title || 'article');
      const uniqueSlug = await ensureUniqueSlug(baseSlug, currentPost?.id);

      const postData = {
        ...formData,
        slug: uniqueSlug,
        publishedAt: currentPost?.publishedAt || Timestamp.now()
      };

      if (currentPost) {
        await updateBlogPost(currentPost.id, postData);
        toast.success('Article mis à jour avec succès');
      } else {
        await createBlogPost(postData);
        toast.success('Article créé avec succès');
      }

      setIsModalOpen(false);
      setCurrentPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        category: '',
        author: 'Coach Ibrahim',
        readTime: '5 min',
        featured: false,
        slug: ''
      });
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      author: post.author,
      readTime: post.readTime,
      featured: post.featured,
      slug: post.slug
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteBlogPost(id);
        toast.success('Article supprimé avec succès');
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Erreur lors de la suppression de l\'article');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const title = post.title || '';
    const excerpt = post.excerpt || '';
    const category = post.category || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (date: string | Date | Timestamp) => {
    if (!date) return '';
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if ('toDate' in date) {
      dateObj = date.toDate();
    } else {
      dateObj = date;
    }
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [
    'Musculation',
    'Nutrition',
    'Récupération',
    'Perte de poids',
    'Lifestyle',
    'Conseils',
    'Performance'
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Articles</h1>
        <button
          onClick={() => {
            setCurrentPost(null);
            setFormData({
              title: '',
              excerpt: '',
              content: '',
              imageUrl: '',
              category: '',
              author: 'Coach Ibrahim',
              readTime: '5 min',
              featured: false,
              slug: ''
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun article trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        {post.featured && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            À la une
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="mr-3">{post.category}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{formatDate(post.publishedAt?.toDate ? post.publishedAt.toDate() : post.publishedAt)}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal pour créer/éditer un article */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentPost ? 'Modifier l\'article' : 'Nouvel article'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg bg-gray-50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extrait
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={10}
                      className="w-full p-3 border rounded-lg font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de l'image
                      </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temps de lecture
                      </label>
                      <input
                        type="text"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Article à la une
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement...' : currentPost ? 'Mettre à jour' : 'Publier'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;