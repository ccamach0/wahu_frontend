import { X, MessageCircle, Heart } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente para mostrar comentarios anidados tipo Facebook
 * Soporta replies a comentarios principales
 */
export default function CommentThread({
  comments = [],
  onAddComment,
  onDeleteComment,
  onAddReply,
  onDeleteReply,
  currentUserId,
  loading = false,
  placeholder = 'Comenta...',
  maxDepth = 2,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      await onAddReply?.(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderComment = (comment, depth = 0) => {
    const isOwnComment = currentUserId && comment.author_id === currentUserId;
    const isReply = depth > 0;

    return (
      <div
        key={comment.id}
        className={`flex gap-3 ${isReply ? 'ml-8 sm:ml-12 mt-3' : 'mt-0'}`}
      >
        {/* Avatar simplificado */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-wahu-500/20 border border-wahu-200 flex items-center justify-center text-xs font-bold text-wahu-600">
            {comment.author_name?.[0]?.toUpperCase() || '?'}
          </div>
        </div>

        {/* Contenido del comentario */}
        <div className="flex-1 min-w-0">
          {/* Autor y metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-800">
              {comment.author_name}
            </span>
            {comment.author_owner_name && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                ({comment.author_owner_name})
              </span>
            )}
            <span className="text-xs text-gray-400">
              {comment.created_at ? new Date(comment.created_at).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : 'Ahora'}
            </span>
          </div>

          {/* Texto del comentario */}
          <div className={`mt-1.5 p-3 rounded-lg text-sm leading-relaxed ${
            comment.sent_as_owner
              ? 'bg-gray-100 text-gray-700 border-l-2 border-gray-400'
              : 'bg-wahu-50 text-gray-800 border-l-2 border-wahu-300'
          }`}>
            {comment.content}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 mt-2">
            {depth < maxDepth && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-600 hover:text-wahu-600 font-medium flex items-center gap-1 transition-colors"
              >
                <MessageCircle size={14} />
                Responder
              </button>
            )}

            {isOwnComment && (
              <button
                onClick={() => onDeleteComment?.(comment.id)}
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                title="Eliminar"
              >
                Eliminar
              </button>
            )}
          </div>

          {/* Formulario de reply */}
          {replyingTo === comment.id && depth < maxDepth && (
            <form
              onSubmit={(e) => handleReplySubmit(e, comment.id)}
              className="mt-3 ml-0 space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta..."
                className="input text-sm resize-none h-12 w-full focus:ring-2 focus:ring-wahu-500"
                disabled={submittingReply}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-50 transition-all"
                >
                  {submittingReply ? '...' : 'Responder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-200 rounded transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Replies anidadas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-0">
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>

        {/* Botón eliminar superpuesto (solo para el autor) */}
        {isOwnComment && depth === 0 && (
          <button
            onClick={() => onDeleteComment?.(comment.id)}
            className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
            title="Eliminar"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-4">
          Sin comentarios aún
        </p>
      ) : (
        comments.map((comment) => renderComment(comment, 0))
      )}
    </div>
  );
}
