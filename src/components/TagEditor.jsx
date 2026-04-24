import { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * TagEditor Component
 * Displays and manages editable pet tags (e.g., #amigable, #activo)
 * Distinct from cards - these are personal, user-created attributes
 */
export default function TagEditor({ tags = [], onAddTag, onRemoveTag, disabled = false, isOwner = false }) {
  const [newTag, setNewTag] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim() || disabled || !isOwner) return;

    setAdding(true);
    try {
      await onAddTag?.(newTag.trim());
      setNewTag('');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTag = (tag) => {
    if (disabled || !isOwner) return;
    onRemoveTag?.(tag);
  };

  // Format tag name: remove # if present, ensure lowercase
  const formatTag = (tag) => {
    const cleaned = tag.replace(/^#/, '').toLowerCase();
    return `#${cleaned}`;
  };

  return (
    <div className="bg-white rounded-xl border border-wahu-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">Tags</h3>
        {isOwner && (
          <span className="text-xs text-gray-400">Personal attributes</span>
        )}
      </div>

      {/* Display existing tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wahu-100 text-wahu-700 text-sm font-medium"
            >
              <span>{formatTag(tag)}</span>
              {isOwner && !disabled && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-wahu-900 transition-colors"
                  title={`Remove tag`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No tags yet</p>
        )}
      </div>

      {/* Add new tag form (only for owner) */}
      {isOwner && !disabled && (
        <form onSubmit={handleAddTag} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a tag (e.g., amigable)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              maxLength={30}
              className="input text-sm w-full"
            />
          </div>
          <button
            type="submit"
            disabled={!newTag.trim() || adding}
            className="btn-primary text-sm py-2 px-3 flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </form>
      )}
    </div>
  );
}
