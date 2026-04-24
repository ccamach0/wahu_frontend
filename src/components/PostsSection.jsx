import { useState } from 'react';
import { User, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import CommentsSection from './CommentsSection.jsx';

export default function PostsSection({
  posts = [],
  onAddPost,
  onDeletePost,
  onAddComment,
  onDeleteComment,
  firstPet,
  user,
  loading = false,
  isProfileOwner = false,
}) {
  const [postText, setPostText] = useState('');
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddPost(postText, sendAsOwner);
      setPostText('');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>;
  }

  return (
    <div className="space-y-4">
      {/* Create post form */}
      {firstPet ? (
        <form onSubmit={handleSubmit} className="card p-4 mb-6">
          {/* Selector sent_as_owner */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSendAsOwner(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                !sendAsOwner ? 'bg-wahu-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <img src={firstPet?.avatar_url} className="w-5 h-5 rounded-full" alt={firstPet?.name} />
              {firstPet?.name}
            </button>
            <button
              type="button"
              onClick={() => setSendAsOwner(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                sendAsOwner ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <User size={14} />
              {user?.name}
            </button>
          </div>

          {/* Post input */}
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="¿Qué está pasando?"
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
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-6">
          <p className="text-xs text-amber-700">
            Necesitas una <span className="font-semibold">mascota activa</span> para publicar.
          </p>
        </div>
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
                  {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {firstPet && post.pet_id === firstPet.id && (
                <button
                  onClick={() => onDeletePost(post.id)}
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
              {expandedPost === post.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Comentarios
            </button>

            {/* Comments section */}
            {expandedPost === post.id && (
              <CommentsSection
                comments={post.comments || []}
                onAddComment={(content, sent_as_owner) => onAddComment(post.id, content, sent_as_owner)}
                onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
                firstPet={firstPet}
                user={user}
                loading={loadingComments[post.id]}
                isProfileOwner={isProfileOwner}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
