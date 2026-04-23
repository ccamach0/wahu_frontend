import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function ImageUpload({ onUpload, onError, maxSize = 10, multiple = false }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (file) => {
    setError('');

    if (!file) {
      setPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      const err = 'Solo se permiten imágenes';
      setError(err);
      onError?.(err);
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      const err = `La imagen debe ser menor a ${maxSize}MB`;
      setError(err);
      onError?.(err);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
  };

  return (
    <div className="space-y-2">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-wahu-500 rounded-lg p-6 text-center cursor-pointer hover:bg-orange-50 transition"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <p className="text-sm text-gray-600 font-medium">
              Arrastra una imagen aquí o <span className="text-wahu-500 underline">selecciona una</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP (máx. {maxSize}MB)</p>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRemove}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Cambiar
            </button>
            <label htmlFor="image-upload-new" className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                id="image-upload-new"
              />
              <div className="px-3 py-2 bg-wahu-500 hover:bg-wahu-600 text-white rounded-lg text-sm font-medium transition cursor-pointer text-center">
                Otra imagen
              </div>
            </label>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-wahu-500"></div>
        </div>
      )}
    </div>
  );
}
