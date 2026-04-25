import { useToast } from '../hooks/useToast.jsx';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, ArrowLeft, PawPrint, Shield, X } from 'lucide-react';
import api from '../services/api.js';
import Gallery from '../components/Gallery.jsx';
import PostsSection from '../components/PostsSection.jsx';
import TagEditor from '../components/TagEditor.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMyPets } from '../hooks/useMyPets.jsx';
import { BUTTON_TEXT } from '../constants/buttonText.js';

const CARD_COLORS = {
  Personalidad: 'bg-pink-100 text-pink-700',
  Salud: 'bg-green-100 text-green-700',
  Comportamiento: 'bg-blue-100 text-blue-700',
  Habilidades: 'bg-purple-100 text-purple-700',
  Energía: 'bg-orange-100 text-orange-700',
};

// Estados posibles: 'loading' | 'none' | 'sent' | 'received' | 'friends'
function useFriendStatus(firstPet, petId) {
  const [status, setStatus] = useState('loading');
  const [friendshipId, setFriendshipId] = useState(null);

  useEffect(() => {
    if (!firstPet || !petId || firstPet.id === petId) { setStatus('none'); return; }
    Promise.all([
      api.getFriendships(firstPet.id),
      api.getSentRequests(firstPet.id),
      api.getPendingRequests(firstPet.id),
    ]).then(([friends, sent, received]) => {
      const allFriendIds = new Set([
        ...(friends.manada || []).map(p => p.id),
        ...(friends.jauria || []).map(p => p.id),
      ]);
      if (allFriendIds.has(petId)) { setStatus('friends'); return; }
      const sentReq = sent.find(r => r.id === petId);
      if (sentReq) { setStatus('sent'); setFriendshipId(sentReq.friendship_id); return; }
      const recvReq = received.find(r => r.id === petId);
      if (recvReq) { setStatus('received'); setFriendshipId(recvReq.friendship_id); return; }
      setStatus('none');
    }).catch(() => setStatus('none'));
  }, [firstPet?.id, petId]);

  return { status, setStatus, friendshipId };
}

export default function PetProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { firstPet } = useMyPets();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFile, setGalleryFile] = useState(null);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [imageComments, setImageComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  useEffect(() => {
    api.getPet(username)
      .then(setPet)
      .catch(() => setPet(null))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!pet?.id) return;
    setPostsLoading(true);
    api.getPetPosts(pet.id, 50)
      .then(res => {
        const postsWithComments = res.posts || [];
        setPosts(postsWithComments);
        // Cargar comentarios para cada post
        postsWithComments.forEach(post => {
          api.getPetPostComments(pet.id, post.id)
            .then(commentsRes => {
              setPosts(prev => prev.map(p =>
                p.id === post.id ? { ...p, comments: commentsRes.comments || [] } : p
              ));
            })
            .catch(() => {
              setPosts(prev => prev.map(p =>
                p.id === post.id ? { ...p, comments: [] } : p
              ));
            });
        });
      })
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, [pet?.id]);

  useEffect(() => {
    if (!pet?.id) return;
    setGalleryLoading(true);
    api.getPetGallery(pet.id, 100)
      .then(res => {
        setGallery(res.images || []);
        // Cargar comentarios para todas las imágenes
        res.images?.forEach(image => {
          setLoadingComments(prev => ({ ...prev, [image.id]: true }));
          api.getPetGalleryComments(pet.id, image.id)
            .then(commentsRes => {
              setImageComments(prev => ({ ...prev, [image.id]: commentsRes.comments || [] }));
            })
            .catch(() => {
              setImageComments(prev => ({ ...prev, [image.id]: [] }));
            })
            .finally(() => {
              setLoadingComments(prev => ({ ...prev, [image.id]: false }));
            });
        });
      })
      .catch(() => setGallery([]))
      .finally(() => setGalleryLoading(false));
  }, [pet?.id]);

  const { status, setStatus, friendshipId } = useFriendStatus(firstPet, pet?.id);

  const isOwnPet = user && pet && pet.companion_id === user.id;

  const handleInvite = async () => {
    if (!firstPet || !pet || actionLoading) return;
    setActionLoading(true);
    try {
      await api.sendFriendRequest({ pet_id: firstPet.id, friend_id: pet.id });
      setStatus('sent');
    } catch (err) {
      toast.error(err.message || 'Error al enviar solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!firstPet || !pet || actionLoading) return;
    if (!confirm(`¿Quitar a ${pet.name} de tu jauría?`)) return;
    setActionLoading(true);
    try {
      await api.deleteFriendship(firstPet.id, pet.id);
      setStatus('none');
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadGalleryPhoto = async () => {
    if (!galleryFile || !pet) return;
    setUploadingGallery(true);
    try {
      const result = await api.uploadPetGalleryImage(pet.id, galleryFile);
      setGallery([...gallery, result]);
      setGalleryFile(null);
    } catch (err) {
      toast.error(err.message || 'Error al subir foto');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleChangeAvatar = async () => {
    if (!avatarFile || !pet) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', avatarFile);
      const result = await api.updatePetAvatar(pet.id, formData);
      setPet({ ...pet, avatar_url: result.avatar_url });
      setEditingAvatar(false);
      setAvatarFile(null);
    } catch (err) {
      toast.error(err.message || 'Error al cambiar avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    try {
      await api.deletePetGalleryImage(pet.id, imageId);
      setGallery(gallery.filter(img => img.id !== imageId));
    } catch (err) {
      toast.error(err.message || 'Error al eliminar foto');
    }
  };

  const handleAccept = async () => {
    if (!friendshipId || actionLoading) return;
    setActionLoading(true);
    try {
      await api.acceptFriendRequest(friendshipId);
      setStatus('friends');
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTag = async (tagName) => {
    if (!pet || !isOwnPet) return;
    try {
      await api.addPetTag(pet.id, tagName);
      setTags([...tags, tagName]);
    } catch (err) {
      toast.error(err.message || 'Error al agregar tag');
    }
  };

  const handleRemoveTag = async (tagName) => {
    if (!pet || !isOwnPet) return;
    try {
      await api.removePetTag(pet.id, tagName);
      setTags(tags.filter(t => t !== tagName));
    } catch (err) {
      toast.error(err.message || 'Error al eliminar tag');
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="card animate-pulse">
        <div className="h-48 bg-wahu-100 rounded-t-2xl" />
        <div className="p-6 flex flex-col gap-4">
          <div className="h-6 bg-wahu-100 rounded w-1/3" />
          <div className="h-4 bg-wahu-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );

  if (!pet) return (
    <div className="max-w-2xl mx-auto px-6 py-8 text-center">
      <PawPrint size={48} className="mx-auto mb-4 text-wahu-200" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Mascota no encontrada</h2>
      <button onClick={() => navigate('/pets')} className="btn-primary mt-4">Ver todas las mascotas</button>
    </div>
  );

  const popularityPct = Math.min(100, Math.round(pet.popularity || 0));

  // Botón según estado de amistad
  const renderFriendButton = () => {
    if (isOwnPet || !firstPet) return null;
    if (status === 'loading') return (
      <div className="w-32 h-9 bg-gray-100 rounded-xl animate-pulse" />
    );
    if (status === 'friends') return (
      <button onClick={handleRemove} disabled={actionLoading}
        className="flex items-center gap-1.5 text-sm py-2 px-4 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50">
        <X size={14} /> {BUTTON_TEXT.REMOVE_FRIEND}
      </button>
    );
    if (status === 'sent') return (
      <span className="flex items-center gap-1.5 text-sm py-2 px-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
        <Shield size={14} /> {BUTTON_TEXT.SENT_REQUEST}
      </span>
    );
    if (status === 'received') return (
      <button onClick={handleAccept} disabled={actionLoading}
        className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4 disabled:opacity-50">
        <Shield size={14} /> {BUTTON_TEXT.ACCEPT_FRIEND}
      </button>
    );
    // none
    return (
      <button onClick={handleInvite} disabled={actionLoading}
        className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4 disabled:opacity-50">
        <Shield size={14} /> {actionLoading ? '...' : BUTTON_TEXT.INVITE_PACK}
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-wahu-500 mb-5 transition-colors">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="card overflow-hidden mb-5">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-wahu-400 to-orange-500 relative">
          <div className="absolute -bottom-10 left-6 group">
            {!editingAvatar ? (
              <>
                <img
                  src={pet.avatar_url || ''}
                  alt={pet.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-wahu-100"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br from-wahu-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {pet.name[0].toUpperCase()}
                </div>
                {isOwnPet && (
                  <button
                    onClick={() => setEditingAvatar(true)}
                    className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium"
                  >
                    Cambiar
                  </button>
                )}
              </>
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-wahu-100 flex items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pet-avatar-upload"
                />
                <label htmlFor="pet-avatar-upload" className="cursor-pointer text-center">
                  <p className="text-xs font-medium text-gray-600">
                    {avatarFile ? '✓' : 'Selecciona'}
                  </p>
                </label>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-4 flex flex-col gap-2">
            {editingAvatar && (
              <div className="flex gap-2">
                <button
                  onClick={handleChangeAvatar}
                  disabled={!avatarFile || avatarUploading}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium disabled:opacity-50"
                >
                  {avatarUploading ? '...' : BUTTON_TEXT.SAVE}
                </button>
                <button
                  onClick={() => {
                    setEditingAvatar(false);
                    setAvatarFile(null);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  {BUTTON_TEXT.CANCEL}
                </button>
              </div>
            )}
            <span className="bg-white/90 text-wahu-600 font-bold text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={13} fill="currentColor" /> Nv. {pet.level}
            </span>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-wahu-500 font-medium text-sm">@{pet.username}</p>
            </div>
            {renderFriendButton()}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">🐾 {pet.species || 'Perro'} · {pet.breed || '—'}</span>
            {pet.location && (
              <span className="flex items-center gap-1"><MapPin size={14} /> {pet.location}</span>
            )}
            <span className="flex items-center gap-1"><Users size={14} /> {pet.friend_count || 0} amigos</span>
          </div>

          {pet.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-wahu-50 rounded-xl px-4 py-3">
              "{pet.bio}"
            </p>
          )}

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Popularidad</span>
              <span className="font-semibold text-wahu-500">{popularityPct}%</span>
            </div>
            <div className="h-2 bg-wahu-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-wahu-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${popularityPct}%` }} />
            </div>
          </div>

          {/* Dueño como hipervínculo */}
          {pet.companion_name && (
            <button
              onClick={() => navigate(`/companions/${pet.companion_username}`)}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-wahu-500 transition-colors mt-2 group">
              <img
                src={pet.companion_avatar || `https://i.pravatar.cc/24?u=${pet.companion_username}`}
                className="w-6 h-6 rounded-full border border-gray-200 group-hover:border-wahu-300 transition-colors"
                onError={e => { e.target.src = `https://i.pravatar.cc/24`; }}
              />
              <span>Compañero: <span className="font-medium text-gray-600 group-hover:text-wahu-600">@{pet.companion_username}</span></span>
            </button>
          )}
        </div>
      </div>

      {/* Etiquetas personales */}
      <div className="mb-5">
        <TagEditor
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          isOwner={isOwnPet}
          disabled={tagsLoading}
        />
      </div>

      {/* Tarjetas */}
      {pet.cards && pet.cards.length > 0 && (
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PawPrint size={16} className="text-wahu-500" /> Tarjetas
          </h2>
          <div className="flex flex-wrap gap-2">
            {pet.cards.map((card) => {
              const colorClass = CARD_COLORS[card.category] || 'bg-gray-100 text-gray-600';
              return (
                <span key={card.id} className={`badge ${colorClass} text-sm`}>{card.name}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Subir foto a galería (solo si es el dueño) */}
      {isOwnPet && (
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            📸 Agregar foto a galería
          </h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                className="hidden"
                id="gallery-upload"
              />
              <label htmlFor="gallery-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-wahu-200 rounded-lg p-3 text-center hover:bg-orange-50 transition">
                  <p className="text-sm text-gray-600">
                    {galleryFile ? `✓ ${galleryFile.name}` : 'Selecciona una foto'}
                  </p>
                </div>
              </label>
            </div>
            <button
              onClick={handleUploadGalleryPhoto}
              disabled={!galleryFile || uploadingGallery}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
            >
              {uploadingGallery ? 'Subiendo...' : BUTTON_TEXT.UPLOAD}
            </button>
          </div>
        </div>
      )}

      {/* Galería */}
      {gallery.length > 0 && (
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            📸 Galería
          </h2>
          <Gallery
            images={gallery}
            loading={galleryLoading}
            isOwner={isOwnPet}
            onDelete={handleDeleteGalleryImage}
            imageComments={imageComments}
            onAddComment={async (imageId, content, sent_as_owner) => {
              try {
                const comment = await api.createPetGalleryComment(pet.id, imageId, content, sent_as_owner);
                setImageComments(prev => ({
                  ...prev,
                  [imageId]: [...(prev[imageId] || []), comment]
                }));
              } catch (err) {
                toast.error(err.message || 'Error al crear comentario');
              }
            }}
            onDeleteComment={async (imageId, commentId) => {
              try {
                await api.deletePetGalleryComment(pet.id, imageId, commentId);
                setImageComments(prev => ({
                  ...prev,
                  [imageId]: prev[imageId].filter(c => c.id !== commentId)
                }));
              } catch {
                toast.error('Error al eliminar comentario');
              }
            }}
            firstPet={firstPet}
            user={user}
            loadingComments={loadingComments}
          />
        </div>
      )}

      {/* Posts */}
      <div className="mb-5">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          💬 Publicaciones
        </h2>
        <PostsSection
          posts={posts}
          onAddPost={async (content, sent_as_owner) => {
            try {
              const newPost = await api.createPetPost(pet.id, content, sent_as_owner);
              setPosts([newPost, ...posts]);
            } catch (err) {
              toast.error(err.message || 'Error al crear publicación');
            }
          }}
          onDeletePost={async (postId) => {
            if (!confirm('¿Eliminar publicación?')) return;
            try {
              await api.deletePetPost(pet.id, postId);
              setPosts(posts.filter(p => p.id !== postId));
            } catch {
              toast.error('Error al eliminar publicación');
            }
          }}
          onAddComment={async (postId, content, sent_as_owner) => {
            try {
              const newComment = await api.createPetPostComment(pet.id, postId, content, sent_as_owner);
              setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
            } catch (err) {
              toast.error(err.message || 'Error al crear comentario');
            }
          }}
          onDeleteComment={async (postId, commentId) => {
            try {
              await api.deletePetPostComment(pet.id, postId, commentId);
              setPosts(posts.map(p => p.id === postId ? { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) } : p));
            } catch {
              toast.error('Error al eliminar comentario');
            }
          }}
          firstPet={firstPet}
          user={user}
          loading={postsLoading}
          isProfileOwner={pet?.companion_id === user?.id}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Nivel', value: pet.level },
          { label: 'XP', value: (pet.xp || 0).toLocaleString() },
          { label: 'Amigos', value: pet.friend_count || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-wahu-500">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
