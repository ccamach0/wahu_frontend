import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Gallery({ images = [], onDelete, isOwner = false, loading = false }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  return (
    <>
      {/* Lightbox */}
      {currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 flex-col">
          <div className="relative max-w-2xl w-full">
            <img
              src={currentImage.image_url}
              alt="Gallery"
              className="w-full h-auto rounded-lg"
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
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedIndex((i) => (i - 1 + images.length) % images.length)}
                className="bg-white hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-white text-sm self-center">
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
          <button
            onClick={() => setSelectedIndex(null)}
            className="mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
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
