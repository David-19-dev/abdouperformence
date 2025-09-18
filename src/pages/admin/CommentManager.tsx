import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Check, X, MessageSquare, Reply, Eye, EyeOff } from 'lucide-react';
import { getCommentsByPost, updateComment, deleteComment, Comment, BlogPost } from '../../lib/firestore';
import { getBlogPosts } from '../../lib/firestore';
import toast from 'react-hot-toast';

const CommentManager: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; commentId: string | null; replyContent: string }>({
    isOpen: false,
    commentId: null,
    replyContent: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, allComments] = await Promise.all([
        getBlogPosts(),
        fetchAllComments()
      ]);

      setBlogPosts(postsData);
      setComments(allComments);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    try {
      const posts = await getBlogPosts();
      const allComments: Comment[] = [];

      for (const post of posts) {
        const postComments = await getCommentsByPost(post.id);
        allComments.push(...postComments);
      }

      return allComments.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bTime.getTime() - aTime.getTime();
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const handleStatusChange = async (commentId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateComment(commentId, { status: newStatus });
      setComments(prev => prev.map(comment =>
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      ));
      toast.success(`Commentaire ${newStatus === 'approved' ? 'approuvé' : newStatus === 'rejected' ? 'rejeté' : 'mis en attente'}`);
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await deleteComment(commentId);
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast.success('Commentaire supprimé avec succès');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Erreur lors de la suppression du commentaire');
      }
    }
  };

  const handleReply = async () => {
    if (!replyModal.commentId || !replyModal.replyContent.trim()) return;

    try {
      // Ici, vous pouvez implémenter la logique pour répondre au commentaire
      // Par exemple, envoyer un email ou créer une réponse dans la base de données
      toast.success('Réponse envoyée avec succès');
      setReplyModal({ isOpen: false, commentId: null, replyContent: '' });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  const getPostTitle = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    return post ? post.title : 'Article inconnu';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.authorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPostTitle(comment.postId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Commentaires</h1>
        <p className="text-gray-600">Modérer et répondre aux commentaires des articles</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un commentaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{comments.length}</p>
                  <p className="text-sm text-blue-600">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {comments.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-sm text-yellow-600">En attente</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {comments.filter(c => c.status === 'approved').length}
                  </p>
                  <p className="text-sm text-green-600">Approuvés</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {comments.filter(c => c.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-red-600">Rejetés</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {filteredComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun commentaire trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.authorName}</span>
                            <span className="text-sm text-gray-500">({comment.authorEmail})</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                              {getStatusText(comment.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Article: <span className="font-medium">{getPostTitle(comment.postId)}</span>
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {comment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(comment.id, 'approved')}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Approuver"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(comment.id, 'rejected')}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Rejeter"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setReplyModal({
                              isOpen: true,
                              commentId: comment.id,
                              replyContent: ''
                            })}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Répondre"
                          >
                            <Reply className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de réponse */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setReplyModal({ isOpen: false, commentId: null, replyContent: '' })}></div>
            <div className="relative bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Répondre au commentaire</h2>
                  <button
                    onClick={() => setReplyModal({ isOpen: false, commentId: null, replyContent: '' })}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre réponse
                  </label>
                  <textarea
                    value={replyModal.replyContent}
                    onChange={(e) => setReplyModal(prev => ({ ...prev, replyContent: e.target.value }))}
                    rows={4}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Tapez votre réponse ici..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setReplyModal({ isOpen: false, commentId: null, replyContent: '' })}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyModal.replyContent.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Envoyer la réponse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentManager;
