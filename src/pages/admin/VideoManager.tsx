import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, X, Calendar, Play, Tag, User, Eye } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  author: string;
  published_at: string;
  duration: string;
  featured: boolean;
}

const VideoManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    category: '',
    author: 'Coach Ibrahim',
    duration: '5:00',
    featured: false
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Erreur lors du chargement des vidéos');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const videoData = {
        ...formData,
        published_at: currentVideo?.published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (currentVideo) {
        const videoRef = doc(db, 'videos', currentVideo.id);
        await updateDoc(videoRef, videoData);
        toast.success('Vidéo mise à jour avec succès');
      } else {
        await addDoc(collection(db, 'videos'), videoData);
        toast.success('Vidéo créée avec succès');
      }

      setIsModalOpen(false);
      setCurrentVideo(null);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        category: '',
        author: 'Coach Ibrahim',
        duration: '5:00',
        featured: false
      });
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Erreur lors de l\'enregistrement de la vidéo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      category: video.category,
      author: video.author,
      duration: video.duration,
      featured: video.featured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await deleteDoc(doc(db, 'videos', id));
        toast.success('Vidéo supprimée avec succès');
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Erreur lors de la suppression de la vidéo');
      }
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
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
    'Performance',
    'Technique',
    'Motivation'
  ];

  const getVideoId = (url: string) => {
    // Extraire l'ID de vidéo YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Extraire l'ID de vidéo Vimeo
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Vidéos</h1>
        <button
          onClick={() => {
            setCurrentVideo(null);
            setFormData({
              title: '',
              description: '',
              video_url: '',
              thumbnail_url: '',
              category: '',
              author: 'Coach Ibrahim',
              duration: '5:00',
              featured: false
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle Vidéo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher une vidéo..."
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
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucune vidéo trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-red-600/80 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        {video.featured && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            À la une
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="mr-3">{video.category}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(video.published_at)}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{video.author}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(video)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <a
                              href={video.video_url}
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

      {/* Modal pour créer/éditer une vidéo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la miniature
                      </label>
                      <input
                        type="url"
                        name="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        placeholder="5:00"
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
                      Vidéo à la une
                    </label>
                  </div>

                  {formData.video_url && (
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
                      {loading ? 'Enregistrement...' : currentVideo ? 'Mettre à jour' : 'Publier'}
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

export default VideoManager;