import { Trash2 } from 'lucide-react';

export default function Comment({ comment, isAuthor, isProfileOwner, onDelete }) {
  return (
    <div className="flex gap-3 mb-4">
      <img
        src={comment.author_avatar || 'https://placedog.net/32/32'}
        alt={comment.author_name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">
          {comment.author_name}
          {comment.author_owner_name && (
            <span className="text-xs text-gray-500 ml-1">
              ({comment.author_owner_name})
            </span>
          )}
        </p>
        <div className={`mt-1 px-4 py-2.5 rounded-2xl break-words ${
          comment.sent_as_owner
            ? 'bg-gray-100 text-gray-700 border border-gray-200'
            : 'bg-orange-200 text-orange-800'
        }`}>
          {comment.content}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {(isAuthor || isProfileOwner) && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1 hover:bg-red-50 rounded-lg transition text-red-500 hover:text-red-600"
          title={isAuthor ? "Eliminar tu comentario" : "Eliminar comentario del perfil"}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
