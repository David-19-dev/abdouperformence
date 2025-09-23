import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, X, Calendar, Play, Image, Tag, User, Eye, Upload } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface MediaItem {
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

const MediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
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
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des éléments média depuis Firestore...');

      const mediaCollection = collection(db, 'gallery');
      const mediaSnapshot = await getDocs(mediaCollection);
      const mediaData = mediaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];

      if (mediaData.length > 0) {
        console.log('✅ Éléments média chargés depuis Firestore:', mediaData.length);
        setMediaItems(mediaData);
      } else {
        console.log('⚠️ Aucun élément trouvé dans Firestore, ajout d\'éléments de test');
        // Ajouter des éléments de test dans Firestore
        await addTestMediaItems();
        // Recharger après l'ajout
        const newSnapshot = await getDocs(mediaCollection);
        const newMediaData = newSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaItem[];
        setMediaItems(newMediaData);
      }

    } catch (error) {
      console.error('❌ Erreur lors du chargement des médias:', error);
      toast.error('Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  const addTestMediaItems = async () => {
    try {
      console.log('🔄 Ajout d\'éléments de test dans Firestore...');
      const testItems = getTestMediaItems();

      for (const item of testItems) {
        const { id, ...itemData } = item;
        await addDoc(collection(db, 'gallery'), itemData);
      }

      console.log('✅ Éléments de test ajoutés avec succès');
      toast.success('Éléments de test ajoutés');
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout des éléments de test:', error);
      toast.error('Erreur lors de l\'ajout des éléments de test');
    }
  };

  const getTestMediaItems = (): MediaItem[] => {
    return [
      {
        id: 'test-1',
        title: 'Séance de coaching personnel',
        description: 'Découvrez nos méthodes d\'entraînement personnalisé avec Coach Ibrahim',
        image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'image',
        category: 'Entraînement',
        author: 'Coach Ibrahim',
        published_at: new Date().toISOString(),
        featured: true,
        tags: ['coaching', 'personnel', 'fitness']
      },
      {
        id: 'test-2',
        title: 'Technique de squat parfaite',
        description: 'Apprenez la technique idéale pour des squats efficaces et sécuritaires',
        image_url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'video',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Technique',
        author: 'Coach Ibrahim',
        published_at: new Date().toISOString(),
        featured: false,
        tags: ['squat', 'technique', 'musculation']
      },
      {
        id: 'test-3',
        title: 'Cours collectif dynamique',
        description: 'Rejoignez nos cours collectifs pour une motivation maximale',
        image_url: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'image',
        category: 'Cours collectifs',
        author: 'Coach Ibrahim',
        published_at: new Date().toISOString(),
        featured: false,
        tags: ['collectif', 'motivation', 'groupe']
      },
      {
        id: 'test-4',
        title: 'Préparation de repas fitness',
        description: 'Découvrez nos conseils nutrition pour optimiser vos performances',
        image_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'video',
        video_url: 'https://vimeo.com/174002812',
        category: 'Nutrition',
        author: 'Coach Ibrahim',
        published_at: new Date().toISOString(),
        featured: false,
        tags: ['nutrition', 'repas', 'fitness']
      }
    ];
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

      const mediaData = {
        ...formData,
        published_at: currentItem?.published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (currentItem) {
        // Mise à jour dans Firestore
        const docRef = doc(db, 'gallery', currentItem.id);
        await updateDoc(docRef, mediaData);
        toast.success('Média mis à jour avec succès');
      } else {
        // Ajout dans Firestore
        await addDoc(collection(db, 'gallery'), mediaData);
        toast.success('Média créé avec succès');
      }

      // Recharger les données
      await fetchMediaItems();

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
    } catch (error) {
      console.error('Error saving media:', error);
      toast.error('Erreur lors de l\'enregistrement du média');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
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
        // Suppression dans Firestore
        const docRef = doc(db, 'gallery', id);
        await deleteDoc(docRef);

        // Recharger les données
        await fetchMediaItems();

        toast.success('Média supprimé avec succès');
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error('Erreur lors de la suppression du média');
      }
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [
    'Entraînement', 'Cours collectifs', 'Performance', 'Nutrition',
    'Plein air', 'Équipement', 'Transformations', 'Événements',
    'Technique', 'Motivation'
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

    if (url.includes('drive.google.com')) {
      const regExp = /(?:\/file\/d\/|\/open\?id=)([a-zA-Z0-9-_]+)/;
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

    if (url.includes('drive.google.com')) {
      return `https://drive.google.com/file/d/${videoId}/preview`;
    }

    return url;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Médias</h1>
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
          Nouveau Média
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un média..."
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
              <span className="ml-3 text-gray-600">Chargement des médias...</span>
            </div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun média trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <div className="relative h-full">
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
                          </div>
                        )}
                        {item.featured && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            À la une
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          {item.type === 'image' ? (
                            <Image className="h-5 w-5 bg-black/50 text-white rounded p-1" />
                          ) : (
                            <Play className="h-5 w-5 bg-black/50 text-white rounded p-1" />
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
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{item.author}</span>
                          </div>
                          <div className="flex space-x-2">
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
                            {item.type === 'video' && item.video_url && (
                              <a
                                href={item.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal pour créer/éditer un média */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentItem ? 'Modifier le média' : 'Nouveau média'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de média
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image (miniature)
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
                        URL de la vidéo (YouTube, Vimeo, Google Drive)
                      </label>
                      <input
                        type="url"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                      />
                    </div>
                  )}

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
                      name="tags"
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

export default MediaManager;
