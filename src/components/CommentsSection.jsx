import { useState } from 'react';
import { User } from 'lucide-react';
import Comment from './Comment.jsx';

export default function CommentsSection({
  comments = [],
  onAddComment,
  onDeleteComment,
  firstPet,
  user,
  loading = false,
  isProfileOwner = false,
}) {
  const [commentText, setCommentText] = useState('');
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(commentText, sendAsOwner);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* Comments list */}
      {comments.length > 0 && (
        <div className="mb-4">
          {comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              isAuthor={firstPet && comment.author_pet_id === firstPet.id}
              isProfileOwner={isProfileOwner}
              onDelete={() => onDeleteComment(comment.id)}
            />
          ))}
        </div>
      )}

      {/* Add comment form */}
      {firstPet ? (
        <form onSubmit={handleSubmit} className="mt-4">
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

          {/* Comment input */}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario..."
            className="input w-full resize-none"
            rows="3"
            disabled={submitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mt-4">
          <p className="text-xs text-amber-700">
            Necesitas una <span className="font-semibold">mascota activa</span> para comentar.
          </p>
        </div>
      )}
    </div>
  );
}
