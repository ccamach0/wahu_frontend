import { useState, useEffect } from 'react';
import { Upload, Trash2, MessageCircle, X } from 'lucide-react';
import api from '../services/api.js';
import Comment from './Comment.jsx';

export default function ClanGallerySection({
  clanId,
  firstPet,
  user,
  userRole,
  isModerator,
  onContentUpdated,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageComments, setImageComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  useEffect(() => {
    loadGallery();
  }, [clanId]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await api.getClanGallery(clanId);
      setImages(data.images || []);
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newImage = await api.uploadClanGalleryImage(clanId, file);
      setImages([newImage, ...images]);
      onContentUpdated?.();
    } catch (err) {
      alert(err.message || 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('¿Eliminar imagen?')) return;

    try {
      await api.deleteClanGalleryImage(clanId, imageId);
      setImages(images.filter(img => img.id !== imageId));
      setSelectedImage(null);
      onContentUpdated?.();
    } catch (err) {
      alert(err.message || 'Error al eliminar imagen');
    }
  };

  const loadImageComments = async (imageId) => {
    if (imageComments[imageId]) return;

    try {
      setLoadingComments(prev => ({ ...prev, [imageId]: true }));
      const comments = await api.getClanGalleryComments(clanId, imageId);
      setImageComments(prev => ({ ...prev, [imageId]: comments }));
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(prev => ({ ...prev, [imageId]: false }));
    }
  };

  const handleAddComment = async (imageId, content) => {
    try {
      const comment = await api.createClanGalleryComment(
        clanId,
        imageId,
        content,
        false
      );
      setImageComments(prev => ({
        ...prev,
        [imageId]: [...(prev[imageId] || []), comment],
      }));
      onContentUpdated?.();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteComment = async (imageId, commentId) => {
    try {
      await api.deleteClanGalleryComment(clanId, imageId, commentId);
      setImageComments(prev => ({
        ...prev,
        [imageId]: prev[imageId].filter(c => c.id !== commentId),
      }));
      onContentUpdated?.();
    } catch (err) {
      alert(err.message || 'Error al eliminar comentario');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload */}
      {firstPet && (
        <label className="card p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-wahu-500 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm font-medium text-gray-700">
              {uploading ? 'Subiendo...' : 'Toca para subir una imagen'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG o WebP, máx 10MB
            </p>
          </div>
        </label>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          <p>La galería está vacía</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map(image => (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => {
                setSelectedImage(image);
                loadImageComments(image.id);
              }}
            >
              <img
                src={image.image_url}
                alt="Galería"
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition flex items-center justify-center gap-2">
                <button
                  className="p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.id);
                  }}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image detail modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl max-h-[90vh] flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Por {selectedImage.uploader_name}
              </p>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image */}
            <div className="px-4 py-4">
              <img
                src={selectedImage.image_url}
                alt="Galería"
                className="w-full rounded-lg"
              />
            </div>

            {/* Comments */}
            <div className="px-4 py-4 border-t space-y-4 flex-1">
              <div className="space-y-3">
                {loadingComments[selectedImage.id] ? (
                  <div className="text-center text-sm text-gray-500">
                    Cargando comentarios...
                  </div>
                ) : imageComments[selectedImage.id]?.length === 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    Sin comentarios aún
                  </p>
                ) : (
                  imageComments[selectedImage.id]?.map(comment => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      isAuthor={comment.author_pet_id === firstPet?.id}
                      isProfileOwner={false}
                      onDelete={() =>
                        handleDeleteComment(selectedImage.id, comment.id)
                      }
                    />
                  ))
                )}
              </div>

              {/* Add comment form */}
              {firstPet && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = e.target.querySelector('input');
                    if (input.value.trim()) {
                      try {
                        await handleAddComment(
                          selectedImage.id,
                          input.value
                        );
                        input.value = '';
                      } catch (err) {
                        alert(err.message);
                      }
                    }
                  }}
                  className="flex gap-2 border-t pt-4"
                >
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    className="input flex-1 text-sm"
                  />
                  <button type="submit" className="btn-primary text-sm">
                    Enviar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
