import { Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';
import Comment from './Comment.jsx';

export default function Gallery({
  images = [],
  onDelete,
  isOwner = false,
  loading = false,
  imageComments = {},
  onAddComment,
  onDeleteComment,
  firstPet,
  user,
  loadingComments = {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No hay imágenes aún</p>
      </div>
    );
  }

  const currentImage = selectedIndex !== null ? images[selectedIndex] : null;
  const currentComments = currentImage ? (imageComments[currentImage.id] || []) : [];

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentImage || submittingComment) return;

    setSubmittingComment(true);
    try {
      await onAddComment?.(currentImage.id, commentText, sendAsOwner);
      setCommentText('');
      setSendAsOwner(false);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <>
      {/* Lightbox */}
      {currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 flex-col overflow-auto">
          <div className="flex w-full max-w-4xl gap-4 mt-8 mb-8">
            {/* Imagen */}
            <div className="flex-1 flex flex-col">
              <div className="relative bg-black rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                <img
                  src={currentImage.image_url}
                  alt="Gallery"
                  className="max-h-96 max-w-full object-contain"
                />
                {isOwner && (
                  <button
                    onClick={() => {
                      onDelete?.(currentImage.id);
                      setSelectedIndex(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Navegación */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  <button
                    onClick={() => setSelectedIndex((i) => (i - 1 + images.length) % images.length)}
                    className="bg-white hover:bg-gray-100 p-2 rounded-lg transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-white text-sm self-center px-4">
                    {selectedIndex + 1} / {images.length}
                  </span>
                  <button
                    onClick={() => setSelectedIndex((i) => (i + 1) % images.length)}
                    className="bg-white hover:bg-gray-100 p-2 rounded-lg transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Comentarios */}
            <div className="w-80 bg-white rounded-lg p-4 flex flex-col max-h-96">
              <h3 className="font-bold text-gray-800 mb-3">Comentarios</h3>

              {/* Lista de comentarios */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2">
                {loadingComments[currentImage.id] ? (
                  <p className="text-xs text-gray-400">Cargando...</p>
                ) : currentComments.length === 0 ? (
                  <p className="text-xs text-gray-400">Sin comentarios aún</p>
                ) : (
                  currentComments.map(comment => (
                    <div key={comment.id} className="text-xs">
                      <p className="font-medium text-gray-800">
                        {comment.author_name}
                        {comment.author_owner_name && (
                          <span className="text-gray-500 text-xs ml-1">
                            ({comment.author_owner_name})
                          </span>
                        )}
                      </p>
                      <div className={`mt-0.5 p-2 rounded text-xs ${
                        comment.sent_as_owner
                          ? 'bg-gray-100 text-gray-700 border border-gray-200'
                          : 'bg-wahu-100 text-wahu-700'
                      }`}>
                        {comment.content}
                      </div>
                      {firstPet && comment.author_pet_id === firstPet.id && (
                        <button
                          onClick={() => onDeleteComment?.(currentImage.id, comment.id)}
                          className="text-red-500 hover:text-red-600 text-xs mt-1"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Form comentario */}
              {firstPet ? (
                <form onSubmit={handleSubmitComment} className="space-y-2 border-t pt-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setSendAsOwner(false)}
                      className={`flex-1 text-xs px-2 py-1 rounded transition ${
                        !sendAsOwner ? 'bg-wahu-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {firstPet.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendAsOwner(true)}
                      className={`flex-1 text-xs px-2 py-1 rounded transition ${
                        sendAsOwner ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Yo
                    </button>
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Comenta..."
                    className="input text-xs resize-none h-16 w-full"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="btn-primary text-xs w-full py-1 disabled:opacity-50"
                  >
                    {submittingComment ? '...' : 'Comentar'}
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-xs text-amber-700">
                  Necesitas mascota para comentar
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedIndex(null)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square group rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-wahu-500 transition"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={image.image_url}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(image.id);
                }}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
