import { useToast } from '../hooks/useToast.jsx';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, User } from 'lucide-react';
import api from '../services/api.js';
import CommentsSection from './CommentsSection.jsx';
import Comment from './Comment.jsx';

export default function ClanPostsSection({
  clanId,
  firstPet,
  user,
  userRole,
  isModerator,
  onContentUpdated,
}) {
  const [posts, setPosts] = useState([]);
  const toast = useToast();
  const [postText, setPostText] = useState('');
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [postComments, setPostComments] = useState({});

  useEffect(() => {
    loadPosts();
  }, [clanId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getClanPosts(clanId);
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const newPost = await api.createClanPost(clanId, postText, sendAsOwner);
      setPosts([newPost, ...posts]);
      setPostText('');
      onContentUpdated?.();
    } catch (err) {
      toast.error(err.message || 'Error al crear publicación');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Eliminar publicación?')) return;

    try {
      await api.deleteClanPost(clanId, postId);
      setPosts(posts.filter(p => p.id !== postId));
      onContentUpdated?.();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar publicación');
    }
  };

  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleAddComment = async (postId, content, sent_as_owner) => {
    try {
      const comment = await api.createClanPostComment(clanId, postId, content, sent_as_owner);
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));
      onContentUpdated?.();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.deleteClanPostComment(clanId, postId, commentId);
      setPostComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(c => c.id !== commentId),
      }));
      onContentUpdated?.();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar comentario');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create post form */}
      {firstPet && (
        <form onSubmit={handleSubmit} className="card p-4 mb-6">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSendAsOwner(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                !sendAsOwner
                  ? 'bg-wahu-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <img
                src={firstPet?.avatar_url}
                className="w-5 h-5 rounded-full"
                alt={firstPet?.name}
              />
              {firstPet?.name}
            </button>
            <button
              type="button"
              onClick={() => setSendAsOwner(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                sendAsOwner
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500'
              }`}
              title={user?.name}
            >
              <User size={14} className="flex-shrink-0" />
              <span className="hidden md:inline">{user?.name}</span>
            </button>
          </div>

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="¿Qué quieres compartir con el clan?"
            className="input w-full resize-none"
            rows="4"
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !postText.trim()}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          <p>No hay publicaciones aún</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="card p-4">
            {/* Post header */}
            <div className="flex gap-3 mb-3">
              <img
                src={post.author_avatar || 'https://placedog.net/32/32'}
                alt={post.author_name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {post.author_name}
                  {post.author_owner_name && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({post.author_owner_name})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}{' '}
                  {new Date(post.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {(post.author_pet_id === firstPet?.id || isModerator) && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="flex-shrink-0 p-1 hover:bg-red-50 rounded-lg transition text-red-500 hover:text-red-600"
                  title="Eliminar publicación"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Post content */}
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>

            {/* Comments toggle */}
            <button
              onClick={() => toggleExpandPost(post.id)}
              className="flex items-center gap-2 text-sm text-wahu-500 hover:text-wahu-600 transition"
            >
              {expandedPost === post.id ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              Comentarios
            </button>

            {/* Comments section */}
            {expandedPost === post.id && (
              <div className="mt-4 border-t pt-4">
                <div className="space-y-3 mb-4">
                  {postComments[post.id]?.map(comment => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      isAuthor={comment.author_pet_id === firstPet?.id}
                      isProfileOwner={false}
                      onDelete={() =>
                        handleDeleteComment(post.id, comment.id)
                      }
                    />
                  ))}
                </div>

                {firstPet && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const input = e.target.querySelector('input');
                      if (input.value.trim()) {
                        try {
                          await handleAddComment(
                            post.id,
                            input.value,
                            false
                          );
                          input.value = '';
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      className="input flex-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="btn-primary text-sm"
                    >
                      Enviar
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
