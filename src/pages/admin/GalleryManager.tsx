import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, X, Calendar, Play, Image, Tag, Eye, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  type: 'image' | 'video';
  video_url?: string;
  category: string;
  author: string;
  published_at: string;
  featured: boolean;
  tags: string[];
}

const GalleryManager: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    type: 'image' as 'image' | 'video',
    video_url: '',
    category: '',
    author: 'Coach Ibrahim',
    featured: false,
    tags: [] as string[]
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const galleryCollection = collection(db, 'gallery');
      const gallerySnapshot = await getDocs(galleryCollection);
      const galleryData = gallerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Erreur lors du chargement de la galerie');
    } finally {
      setLoading(false);
    }
  };

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags: tags
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const itemData = {
        ...formData,
        published_at: currentItem?.published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (currentItem) {
        const itemRef = doc(db, 'gallery', currentItem.id);
        await updateDoc(itemRef, itemData);
        toast.success('Élément de galerie mis à jour avec succès');
      } else {
        await addDoc(collection(db, 'gallery'), itemData);
        toast.success('Élément de galerie créé avec succès');
      }

      setIsModalOpen(false);
      setCurrentItem(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        type: 'image',
        video_url: '',
        category: '',
        author: 'Coach Ibrahim',
        featured: false,
        tags: []
      });
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'élément');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      type: item.type,
      video_url: item.video_url || '',
      category: item.category,
      author: item.author,
      featured: item.featured,
      tags: item.tags || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
        toast.success('Élément supprimé avec succès');
        fetchGalleryItems();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        toast.error('Erreur lors de la suppression de l\'élément');
      }
    }
  };

  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [
    'Entraînement',
    'Cours collectifs',
    'Performance',
    'Nutrition',
    'Plein air',
    'Équipement',
    'Transformations',
    'Événements',
    'Technique',
    'Motivation'
  ];

  const getVideoId = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }

    if (url.includes('vimeo.com')) {
      const regExp = /vimeo\.com\/([0-9]+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }

    return null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getVideoId(url);

    if (!videoId) return url;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes('vimeo.com')) {
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de la Galerie</h1>
        <button
          onClick={() => {
            setCurrentItem(null);
            setFormData({
              title: '',
              description: '',
              image_url: '',
              type: 'image',
              video_url: '',
              category: '',
              author: 'Coach Ibrahim',
              featured: false,
              tags: []
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel élément
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher dans la galerie..."
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
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun élément trouvé dans la galerie</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        {item.type === 'image' ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-12 h-12 bg-red-600/80 rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </>
                        )}
                        {item.featured && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            À la une
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {item.type === 'image' ? (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Image className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <Play className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="mr-3">{item.category}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(item.published_at)}</span>
                        </div>
                        <h3 className="font-bold text-sm mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{item.author}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <a
                              href={item.type === 'video' ? (item.video_url || item.image_url) : item.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
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

      {/* Modal pour créer/éditer un élément */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentItem ? 'Modifier l\'élément' : 'Nouvel élément'}
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
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      >
                        <option value="image">Image</option>
                        <option value="video">Vidéo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de l'image {formData.type === 'video' ? '(Miniature)' : ''}
                      </label>
                      <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    {formData.type === 'video' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL de la vidéo (YouTube ou Vimeo)
                        </label>
                        <input
                          type="url"
                          name="video_url"
                          value={formData.video_url}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format: https://www.youtube.com/watch?v=XXXX ou https://vimeo.com/XXXX
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        Auteur
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      className="w-full p-3 border rounded-lg"
                      placeholder="fitness, musculation, technique..."
                    />
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
                      Élément à la une
                    </label>
                  </div>

                  {formData.type === 'video' && formData.video_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aperçu de la vidéo
                      </label>
                      <div className="relative pb-[56.25%] h-0 bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          src={getEmbedUrl(formData.video_url)}
                          className="absolute top-0 left-0 w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

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
                      {loading ? 'Enregistrement...' : currentItem ? 'Mettre à jour' : 'Publier'}
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

export default GalleryManager;
