import { Trash2, ChevronLeft, ChevronRight, User, X, ZoomIn, MessageCircle, Send, Check, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal.jsx';

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
  const [transitionDirection, setTransitionDirection] = useState('next');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, imageId: null, deleting: false });

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  const goToNext = () => {
    setTransitionDirection('next');
    setSelectedIndex((i) => (i + 1) % images.length);
  };

  const goToPrevious = () => {
    setTransitionDirection('prev');
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  };

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
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .lightbox-overlay {
          animation: fadeInScale 0.3s ease-out;
        }

        .carousel-image {
          animation: ${transitionDirection === 'next' ? 'slideInFromRight' : 'slideInFromLeft'} 0.4s ease-out;
        }

        .dot-nav button.active {
          background-color: white;
        }

        .dot-nav button.inactive {
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      {/* Lightbox */}
      {currentImage && (
        <div className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center p-4 lightbox-overlay">
          <div className="w-full max-w-3xl">
            {/* Imagen principal con controles */}
            <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center mb-6 shadow-2xl" style={{ maxHeight: '600px' }}>
              <img
                key={`img-${selectedIndex}`}
                src={currentImage.image_url}
                alt="Gallery"
                className="max-h-full max-w-full object-contain carousel-image"
              />

              {/* Controles superpuestos */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-between p-4">
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                      title="Anterior (←)"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={goToNext}
                      className="bg-white/80 hover:bg-white text-black p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                      title="Siguiente (→)"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {isOwner && (
                <button
                  onClick={() => setDeleteConfirm({ open: true, imageId: currentImage.id, deleting: false })}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all hover:scale-110 shadow-lg"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {/* Navegación con puntos */}
            {images.length > 1 && (
              <div className="flex flex-col items-center gap-4 mb-6">
                {/* Indicador de página */}
                <div className="text-white text-sm font-medium">
                  {selectedIndex + 1} de {images.length}
                </div>

                {/* Puntos de navegación */}
                <div className="flex gap-2 dot-nav flex-wrap justify-center">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTransitionDirection(index > selectedIndex ? 'next' : 'prev');
                        setSelectedIndex(index);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all hover:scale-125 ${
                        index === selectedIndex ? 'active' : 'inactive'
                      }`}
                      title={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comentarios */}
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-wahu-500 rounded"></span>
                Comentarios
              </h3>

              {/* Lista de comentarios */}
              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                {loadingComments[currentImage.id] ? (
                  <p className="text-xs text-gray-400 italic">Cargando...</p>
                ) : currentComments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Sin comentarios aún</p>
                ) : (
                  currentComments.map(comment => (
                    <div key={comment.id} className="border-l-2 border-wahu-200 pl-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800">
                            {comment.author_name}
                            {comment.author_owner_name && (
                              <span className="text-gray-500 text-xs ml-1 font-normal">
                                ({comment.author_owner_name})
                              </span>
                            )}
                          </p>
                          <div className={`mt-1.5 p-2.5 rounded text-xs leading-relaxed ${
                            comment.sent_as_owner
                              ? 'bg-gray-100 text-gray-700 border-l-2 border-gray-400'
                              : 'bg-wahu-50 text-wahu-700 border-l-2 border-wahu-300'
                          }`}>
                            {comment.content}
                          </div>
                        </div>
                        {firstPet && comment.author_pet_id === firstPet.id && (
                          <button
                            onClick={() => onDeleteComment?.(currentImage.id, comment.id)}
                            className="text-red-500 hover:text-red-600 flex-shrink-0 transition-colors"
                            title="Eliminar"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form comentario */}
              {firstPet ? (
                <form onSubmit={handleSubmitComment} className="space-y-3 border-t pt-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSendAsOwner(false)}
                      className={`flex-1 text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                        !sendAsOwner
                          ? 'bg-wahu-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🐾 {firstPet.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendAsOwner(true)}
                      className={`flex-1 text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                        sendAsOwner
                          ? 'bg-gray-700 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      👤 Yo
                    </button>
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="input text-xs resize-none h-14 w-full focus:ring-2 focus:ring-wahu-500"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="btn-primary text-xs w-full py-2.5 font-medium disabled:opacity-50 transition-all hover:shadow-md flex items-center justify-center gap-2"
                  >
                    {submittingComment ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Comentar
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 border-l-2 border-amber-400 rounded-lg px-3 py-2.5 text-xs text-amber-700 font-medium flex items-center gap-2">
                  <AlertCircle size={14} />
                  Necesitas una mascota para comentar
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setSelectedIndex(null)}
                className="px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                title="Cerrar (Esc)"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Eliminar imagen"
        message="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        severity="danger"
        loading={deleteConfirm.deleting}
        onConfirm={async () => {
          setDeleteConfirm({ ...deleteConfirm, deleting: true });
          try {
            await onDelete?.(deleteConfirm.imageId);
            setDeleteConfirm({ open: false, imageId: null, deleting: false });
            setSelectedIndex(null);
          } finally {
            setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
          }
        }}
        onCancel={() => setDeleteConfirm({ open: false, imageId: null, deleting: false })}
      />

      {/* Grid de miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square group rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-wahu-500 transition-all duration-300 hover:shadow-lg hover:shadow-wahu-200"
            onClick={() => {
              setTransitionDirection(index > (selectedIndex || 0) ? 'next' : 'prev');
              setSelectedIndex(index);
            }}
          >
            {/* Imagen */}
            <img
              src={image.image_url}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Overlay de hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
            </div>

            {/* Botón de eliminar */}
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm({ open: true, imageId: image.id, deleting: false });
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            )}

            {/* Número de imagen */}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {index + 1}/{images.length}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
