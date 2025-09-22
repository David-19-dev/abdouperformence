import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Image, Filter, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  type: 'image' | 'video';
  videoUrl?: string;
  thumbnail?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Séance de coaching personnel',
    category: 'training',
    type: 'image'
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Cours collectif',
    category: 'classes',
    type: 'image'
  },
  {
    id: 3,
    src: '',
    alt: 'Technique de squat',
    category: 'training',
    type: 'video',
    videoUrl: 'https://player.vimeo.com/video/174002812',
    thumbnail: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Coaching performance sportive',
    category: 'performance',
    type: 'image'
  },
  {
    id: 5,
    src: '',
    alt: 'Techniques de course',
    category: 'performance',
    type: 'video',
    videoUrl: 'https://player.vimeo.com/video/183849543',
    thumbnail: 'https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Coaching nutritionnel',
    category: 'nutrition',
    type: 'image'
  },
  {
    id: 7,
    src: '',
    alt: 'Préparation de repas fitness',
    category: 'nutrition',
    type: 'video',
    videoUrl: 'https://player.vimeo.com/video/166807261',
    thumbnail: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Entraînement en plein air',
    category: 'outdoor',
    type: 'image'
  },
  {
    id: 9,
    src: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Équipement fitness',
    category: 'equipment',
    type: 'image'
  }
];

const categories = [
  { id: 'tous', label: 'Tous', icon: '🏋️‍♂️' },
  { id: 'training', label: 'Entraînement', icon: '💪' },
  { id: 'classes', label: 'Cours', icon: '👥' },
  { id: 'performance', label: 'Performance', icon: '🏆' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'outdoor', label: 'Plein air', icon: '🌳' },
  { id: 'equipment', label: 'Équipement', icon: '⚙️' },
  { id: 'video', label: 'Vidéos', icon: '🎬' }
];

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  // Simuler un chargement pour l'effet visuel
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const filteredItems = activeCategory === 'tous' 
    ? galleryItems 
    : activeCategory === 'video'
    ? galleryItems.filter(item => item.type === 'video')
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    // Désactiver le scroll quand la modal est ouverte
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    // Réactiver le scroll
    document.body.style.overflow = '';
  };

  // Fermer la modal avec la touche Escape
  React.useEffect(() => {
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
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
          }`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl ${
                  viewMode === 'grid' ? 'h-64' : 'break-inside-avoid mb-6'
                }`}
                onClick={() => openModal(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative h-64 w-full">
                    <img
                      src={item.thumbnail}
                      alt={item.alt}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-medium">{item.alt}</p>
                    <div className="flex items-center mt-2">
                      {item.type === 'image' ? (
                        <Image className="h-4 w-4 text-red-300 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 text-red-300 mr-2" />
                      )}
                      <p className="text-red-300 text-sm capitalize">
                        {categories.find(cat => cat.id === item.category)?.label || item.category}
                      </p>
                    </div>
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
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Contactez-nous pour une séance photo/vidéo
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Modal pour afficher les éléments en grand */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeModal}>
          <div 
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.type === 'image' ? (
              <img 
                src={selectedItem.src} 
                alt={selectedItem.alt} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            ) : (
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  src={`${selectedItem.videoUrl}?autoplay=1&title=0&byline=0&portrait=0`} 
                  className="absolute top-0 left-0 w-full h-full" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedItem.alt}</h3>
              <p className="text-gray-600">
                Catégorie: {categories.find(cat => cat.id === selectedItem.category)?.label || selectedItem.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;