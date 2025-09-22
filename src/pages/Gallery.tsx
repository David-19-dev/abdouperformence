import React, { useState, useEffect } from 'react';
import { Play, Image, Filter, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

const categories = [
  { id: 'tous', label: 'Tous', icon: '🏋️‍♂️' },
  { id: 'Entraînement', label: 'Entraînement', icon: '💪' },
  { id: 'Cours collectifs', label: 'Cours', icon: '👥' },
  { id: 'Performance', label: 'Performance', icon: '🏆' },
  { id: 'Nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'Plein air', label: 'Plein air', icon: '🌳' },
  { id: 'Équipement', label: 'Équipement', icon: '⚙️' },
  { id: 'Transformations', label: 'Transformations', icon: '🔄' },
  { id: 'Événements', label: 'Événements', icon: '🎉' },
  { id: 'Technique', label: 'Technique', icon: '🎯' },
  { id: 'Motivation', label: 'Motivation', icon: '🔥' },
  { id: 'video', label: 'Vidéos', icon: '🎬' }
];

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const galleryCollection = collection(db, 'gallery');
      const galleryQuery = query(galleryCollection, orderBy('created_at', 'desc'));
      const gallerySnapshot = await getDocs(galleryQuery);
      const galleryData = gallerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      // Fallback to static data if Firebase fails
      setGalleryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = activeCategory === 'tous'
    ? galleryItems
    : activeCategory === 'video'
    ? galleryItems.filter(item => item.type === 'video')
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = '';
  };

  // Fermer la modal avec la touche Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header avec animation */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4 animate-fade-in">
            NOTRE UNIVERS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Galerie BBP Performance
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-delay">
            Découvrez notre environnement d'entraînement, nos équipements et les transformations de nos clients.
          </p>
        </div>

        {/* Contrôles et filtres */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-in-delay">
          <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
              aria-label="Vue grille"
            >
              <div className="grid grid-cols-2 gap-1 w-5 h-5">
                <div className={`${viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-400'} w-2 h-2 rounded-sm`}></div>
                <div className={`${viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-400'} w-2 h-2 rounded-sm`}></div>
                <div className={`${viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-400'} w-2 h-2 rounded-sm`}></div>
                <div className={`${viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-400'} w-2 h-2 rounded-sm`}></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'masonry' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
              aria-label="Vue masonry"
            >
              <div className="flex flex-col gap-1 w-5 h-5">
                <div className={`${viewMode === 'masonry' ? 'bg-red-600' : 'bg-gray-400'} w-full h-1 rounded-sm`}></div>
                <div className={`${viewMode === 'masonry' ? 'bg-red-600' : 'bg-gray-400'} w-3/4 h-1 rounded-sm`}></div>
                <div className={`${viewMode === 'masonry' ? 'bg-red-600' : 'bg-gray-400'} w-full h-1 rounded-sm`}></div>
                <div className={`${viewMode === 'masonry' ? 'bg-red-600' : 'bg-gray-400'} w-2/3 h-1 rounded-sm`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Galerie */}
        {!isLoading && (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
          }`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  viewMode === 'grid' ? 'h-64' : 'break-inside-avoid mb-6'
                }`}
                onClick={() => openModal(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative h-64 w-full">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600/80 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    À la une
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-medium mb-1">{item.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-red-300 text-sm">
                        {item.type === 'image' ? (
                          <Image className="h-4 w-4 mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        <span>{item.category}</span>
                      </div>
                      <span className="text-red-300 text-xs">{formatDate(item.published_at)}</span>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-red-600/20 text-red-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun élément trouvé</h3>
            <p className="text-gray-500 mb-4">Aucun élément ne correspond à ce filtre.</p>
            <button
              onClick={() => setActiveCategory('tous')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Voir tous les éléments
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
            <span>Contactez-nous pour une séance photo/vidéo</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Modal pour afficher les éléments en grand */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={closeModal}>
          <div
            className="max-w-5xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              ) : (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={`${getEmbedUrl(selectedItem.video_url || '')}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                {selectedItem.featured && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    À la une
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{selectedItem.category}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{selectedItem.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(selectedItem.published_at)}</span>
                </div>
              </div>
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
