import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, PawPrint, Trash2, Star, ExternalLink, X, MessageSquare, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePetContext } from '../hooks/usePetContext.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import Gallery from '../components/Gallery.jsx';
import PostsSection from '../components/PostsSection.jsx';
import TagEditor from '../components/TagEditor.jsx';
import api from '../services/api.js';
import { BUTTON_TEXT } from '../constants/buttonText.js';

const SPECIES = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Hamster', 'Otro'];
const GENDERS = ['Macho', 'Hembra', 'No especificado'];

export default function Companion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pets, activePet, setActivePet, addPet, removePet, loading } = usePetContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', breed: '', species: 'Perro', location: '', bio: '', age: '', gender: 'Macho' });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [userGallery, setUserGallery] = useState([]);
  const [galleryFile, setGalleryFile] = useState(null);
  const [uploadingUserGallery, setUploadingUserGallery] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [galleryComments, setGalleryComments] = useState({});
  const [loadingGalleryComments, setLoadingGalleryComments] = useState({});
  const [petTags, setPetTags] = useState({});
  const [expandedPetTags, setExpandedPetTags] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSetByUser, setPasswordSetByUser] = useState(true); // Asumir que tiene contraseña real por defecto

  useEffect(() => {
    if (!user?.id) return;
    api.getCompanionGallery(user.id, 100)
      .then(res => {
        setUserGallery(res.images || []);
        // Cargar comentarios para todas las imágenes
        res.images?.forEach(image => {
          setLoadingGalleryComments(prev => ({ ...prev, [image.id]: true }));
          api.getCompanionGalleryComments(user.id, image.id)
            .then(commentsRes => {
              setGalleryComments(prev => ({ ...prev, [image.id]: commentsRes.comments || [] }));
            })
            .catch(() => {
              setGalleryComments(prev => ({ ...prev, [image.id]: [] }));
            })
            .finally(() => {
              setLoadingGalleryComments(prev => ({ ...prev, [image.id]: false }));
            });
        });
      })
      .catch(() => setUserGallery([]));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    setPostsLoading(true);
    api.getCompanionPosts(user.id, 50)
      .then(res => {
        const postsWithComments = res.posts || [];
        setMyPosts(postsWithComments);
        // Cargar comentarios para cada post
        postsWithComments.forEach(post => {
          api.getCompanionPostComments(user.id, post.id)
            .then(commentsRes => {
              setMyPosts(prev => prev.map(p =>
                p.id === post.id ? { ...p, comments: commentsRes.comments || [] } : p
              ));
            })
            .catch(() => {
              setMyPosts(prev => prev.map(p =>
                p.id === post.id ? { ...p, comments: [] } : p
              ));
            });
        });
      })
      .catch(() => setMyPosts([]))
      .finally(() => setPostsLoading(false));
  }, [user?.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.username) return setError('Nombre y username son requeridos');
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('username', form.username);
      data.append('breed', form.breed);
      data.append('species', form.species);
      data.append('location', form.location);
      data.append('bio', form.bio);
      data.append('age', form.age);
      data.append('gender', form.gender);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const newPet = await api.createPet(data);
      addPet(newPet);
      setForm({ name: '', username: '', breed: '', species: 'Perro', location: '', bio: '', age: '', gender: 'Macho' });
      setImageFile(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Error al crear mascota');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!petToDelete) return;
    try {
      await api.deletePet(petToDelete.id);
      removePet(petToDelete.id);
    } catch (err) {
      alert(err.message || 'Error al eliminar mascota');
    } finally {
      setPetToDelete(null);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const data = new FormData();
      if (profileForm.name) data.append('name', profileForm.name);
      if (profileForm.bio) data.append('bio', profileForm.bio);
      if (profileImage) data.append('image', profileImage);

      await api.updateCompanionProfile(user.id, data);
      setEditingProfile(false);
      setProfileImage(null);
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Error al actualizar perfil');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordSetByUser && !passwordForm.currentPassword) {
      setPasswordError('La contraseña actual es requerida');
      return;
    }

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Todos los campos son requeridos');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      alert('Contraseña cambiada exitosamente');
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Error al cambiar contraseña');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleUploadUserGallery = async () => {
    if (!galleryFile || !user) return;
    setUploadingUserGallery(true);
    try {
      const result = await api.uploadCompanionGalleryImage(user.id, galleryFile);
      setUserGallery([...userGallery, result]);
      setGalleryFile(null);
    } catch (err) {
      alert(err.message || 'Error al subir foto');
    } finally {
      setUploadingUserGallery(false);
    }
  };

  const handleDeleteUserGalleryImage = async (imageId) => {
    try {
      await api.deleteCompanionGalleryImage(user.id, imageId);
      setUserGallery(userGallery.filter(img => img.id !== imageId));
    } catch (err) {
      alert(err.message || 'Error al eliminar foto');
    }
  };

  const handleAddPetTag = (petId) => async (tagName) => {
    try {
      await api.addPetTag(petId, tagName);
      setPetTags(prev => ({
        ...prev,
        [petId]: [...(prev[petId] || []), tagName]
      }));
    } catch (err) {
      alert(err.message || 'Error al agregar tag');
    }
  };

  const handleRemovePetTag = (petId) => async (tagName) => {
    try {
      await api.removePetTag(petId, tagName);
      setPetTags(prev => ({
        ...prev,
        [petId]: (prev[petId] || []).filter(t => t !== tagName)
      }));
    } catch (err) {
      alert(err.message || 'Error al eliminar tag');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {petToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Eliminar mascota"
          message={`¿Estás seguro que deseas eliminar a ${petToDelete.name}? Se perderá toda la información de esta mascota: perfil, tarjetas, clanes y amigos. Esta acción no se puede deshacer.`}
          confirmText={BUTTON_TEXT.DELETE}
          severity="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPetToDelete(null)}
        />
      )}

      <div className="page-header">
        <User className="page-icon" />
        <h1 className="page-title">Compañero</h1>
        <p className="page-subtitle">Gestiona tu perfil y tus mascotas</p>
      </div>

      {/* Perfil */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4">
          <h2 className="font-bold text-gray-800">Mi perfil</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowChangePassword(true);
                // Detectar si el usuario ha establecido una contraseña real (no solo la del Google Auth)
                api.hasPassword().then(res => {
                  console.log('hasPassword response:', res);
                  console.log('passwordSetByUser value:', res.passwordSetByUser);
                  setPasswordSetByUser(res.passwordSetByUser ?? true);
                }).catch(err => {
                  console.error('hasPassword error:', err);
                  setPasswordSetByUser(true);
                });
              }}
              className="flex items-center gap-2 text-sm btn-secondary py-1.5 px-3 whitespace-nowrap"
              title="Cambiar contraseña"
            >
              <Lock size={14} />
              <span className="hidden md:inline">Contraseña</span>
            </button>
            <button
              onClick={() => {
                setEditingProfile(!editingProfile);
                setProfileForm({ name: user?.name || '', bio: user?.bio || '' });
              }}
              className="text-sm btn-secondary py-1.5"
            >
              {editingProfile ? BUTTON_TEXT.CANCEL : 'Editar'}
            </button>
          </div>
        </div>

        {!editingProfile ? (
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || `https://i.pravatar.cc/80?u=${user?.id}`}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-wahu-200"
            />
            <div>
              <p className="font-bold text-gray-800 text-lg">{user?.name || 'Tu nombre'}</p>
              <p className="text-wahu-500 font-medium text-sm">@{user?.username || 'tu_usuario'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Nombre</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="input w-full"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="input w-full resize-none h-20"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Avatar (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="hidden"
                id="profile-avatar-upload"
              />
              <label htmlFor="profile-avatar-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-wahu-200 rounded-lg p-4 text-center hover:bg-orange-50 transition">
                  <p className="text-sm text-gray-600">
                    {profileImage ? `✓ ${profileImage.name}` : 'Selecciona una imagen'}
                  </p>
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="btn-primary w-full"
            >
              {profileSaving ? 'Guardando...' : BUTTON_TEXT.SAVE}
            </button>
          </form>
        )}
      </div>

      {/* Galería del usuario */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-3">Mi galería</h2>
        <div className="flex gap-3 items-end mb-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
              className="hidden"
              id="user-gallery-upload"
            />
            <label htmlFor="user-gallery-upload" className="block cursor-pointer">
              <div className="border-2 border-dashed border-wahu-200 rounded-lg p-3 text-center hover:bg-orange-50 transition">
                <p className="text-sm text-gray-600">
                  {galleryFile ? `✓ ${galleryFile.name}` : 'Selecciona una foto'}
                </p>
              </div>
            </label>
          </div>
          <button
            onClick={handleUploadUserGallery}
            disabled={!galleryFile || uploadingUserGallery}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {uploadingUserGallery ? 'Subiendo...' : BUTTON_TEXT.UPLOAD}
          </button>
        </div>
        <Gallery
          images={userGallery}
          onDelete={handleDeleteUserGalleryImage}
          isOwner={true}
          imageComments={galleryComments}
          onAddComment={async (imageId, content, sent_as_owner) => {
            try {
              const comment = await api.createCompanionGalleryComment(user.id, imageId, content, sent_as_owner);
              setGalleryComments(prev => ({
                ...prev,
                [imageId]: [...(prev[imageId] || []), comment]
              }));
            } catch (err) {
              alert(err.message || 'Error al crear comentario');
            }
          }}
          onDeleteComment={async (imageId, commentId) => {
            try {
              await api.deleteCompanionGalleryComment(user.id, imageId, commentId);
              setGalleryComments(prev => ({
                ...prev,
                [imageId]: prev[imageId].filter(c => c.id !== commentId)
              }));
            } catch {
              alert('Error al eliminar comentario');
            }
          }}
          firstPet={activePet}
          user={user}
          loadingComments={loadingGalleryComments}
        />
      </div>

      {/* Header mis mascotas */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">Mis mascotas</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          <Plus size={16} />
          + {BUTTON_TEXT.CREATE}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card p-6 mb-5 border-2 border-wahu-200">
          <h3 className="font-bold text-gray-800 mb-4">Nueva mascota</h3>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-3 border border-red-100">{error}</div>}
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
              <input className="input text-sm" placeholder="Max" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Username (@) *</label>
              <input className="input text-sm" placeholder="max_golden" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '_') })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Especie</label>
              <select className="input text-sm" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}>
                {SPECIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Raza</label>
              <input className="input text-sm" placeholder="Golden Retriever" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Edad (años)</label>
              <input type="number" min="0" step="0.5" className="input text-sm" placeholder="2.5" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sexo</label>
              <select className="input text-sm" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Ubicación</label>
              <input className="input text-sm" placeholder="Lima, Perú" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
              <textarea className="input text-sm resize-none h-16" placeholder="Cuéntanos sobre tu mascota..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">Avatar (opcional)</label>
              <div className="border-2 border-dashed border-wahu-500 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        setError('La imagen debe ser menor a 10MB');
                        return;
                      }
                      setImageFile(file);
                    }
                  }}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="block cursor-pointer">
                  <p className="text-sm text-gray-600 font-medium">
                    {imageFile ? `✓ ${imageFile.name}` : 'Selecciona una imagen'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (máx. 10MB)</p>
                </label>
              </div>
            </div>
            <div className="col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2 flex-1">
                <PawPrint size={16} /> {saving ? 'Creando...' : BUTTON_TEXT.CREATE}
              </button>
              <button type="button" className="btn-secondary text-sm py-2" onClick={() => setShowForm(false)}>
                {BUTTON_TEXT.CANCEL}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-wahu-100 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-wahu-100 rounded w-1/3" />
                <div className="h-3 bg-wahu-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <PawPrint size={44} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aún no tienes mascotas registradas</p>
          <p className="text-xs mt-1">Agrega tu primera mascota para comenzar</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pets.map(pet => (
            <div key={pet.id} className="flex flex-col">
              <div className="card flex items-center gap-4 p-4">
                <button
                  onClick={() => navigate(`/pets/${pet.username}`)}
                  className="flex-shrink-0 group relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-wahu-100 group-hover:border-wahu-400 transition-colors">
                    {pet.avatar_url ? (
                      <img src={pet.avatar_url} alt={pet.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.nextSibling?.classList.remove('hidden');
                        }} />
                    ) : null}
                    <div className={`${pet.avatar_url ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-wahu-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold`}>
                      {pet.name[0].toUpperCase()}
                    </div>
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <button onClick={() => navigate(`/pets/${pet.username}`)}
                    className="font-bold text-gray-800 hover:text-wahu-600 transition-colors flex items-center gap-1">
                    {pet.name} <ExternalLink size={12} className="opacity-40" />
                  </button>
                  <p className="text-xs text-wahu-500">@{pet.username}</p>
                  <p className="text-xs text-gray-400">{pet.species} · {pet.breed}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-wahu-100 text-wahu-600">Nv.{pet.level}</span>
                  <button
                    onClick={() => setActivePet(pet)}
                    title={activePet?.id === pet.id ? 'Mascota activa' : 'Seleccionar como activa'}
                    className={`p-1.5 rounded-lg transition-colors ${activePet?.id === pet.id ? 'text-wahu-500 bg-wahu-50' : 'text-gray-300 hover:text-wahu-400 hover:bg-wahu-50'}`}
                  >
                    <Star size={15} fill={activePet?.id === pet.id ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => setExpandedPetTags(expandedPetTags === pet.id ? null : pet.id)}
                    title="Gestionar tags"
                    className="p-1.5 hover:bg-wahu-50 rounded-lg text-gray-400 hover:text-wahu-500 transition-colors"
                  >
                    <PawPrint size={15} />
                  </button>
                  <button
                    onClick={() => setPetToDelete(pet)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {expandedPetTags === pet.id && (
                <div className="p-4 bg-white border-l-4 border-wahu-500">
                  <TagEditor
                    tags={petTags[pet.id] || []}
                    onAddTag={handleAddPetTag(pet.id)}
                    onRemoveTag={handleRemovePetTag(pet.id)}
                    isOwner={true}
                    disabled={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mis publicaciones */}
      <div className="mt-8 mb-5">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MessageSquare size={20} className="text-wahu-500" />
          Mis publicaciones en el perfil
        </h2>
        <PostsSection
          posts={myPosts}
          onAddPost={async (content, sent_as_owner) => {
            try {
              const newPost = await api.createCompanionPost(user.id, content, sent_as_owner);
              setMyPosts([newPost, ...myPosts]);
            } catch (err) {
              alert(err.message || 'Error al crear publicación');
            }
          }}
          onDeletePost={async (postId) => {
            if (!confirm('¿Eliminar publicación?')) return;
            try {
              await api.deleteCompanionPost(user.id, postId);
              setMyPosts(myPosts.filter(p => p.id !== postId));
            } catch {
              alert('Error al eliminar publicación');
            }
          }}
          onAddComment={async (postId, content, sent_as_owner) => {
            try {
              const newComment = await api.createCompanionPostComment(user.id, postId, content, sent_as_owner);
              setMyPosts(myPosts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
            } catch (err) {
              alert(err.message || 'Error al crear comentario');
            }
          }}
          onDeleteComment={async (postId, commentId) => {
            try {
              await api.deleteCompanionPostComment(user.id, postId, commentId);
              setMyPosts(myPosts.map(p => p.id === postId ? { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) } : p));
            } catch {
              alert('Error al eliminar comentario');
            }
          }}
          firstPet={activePet}
          user={user}
          loading={postsLoading}
          isProfileOwner={true}
        />
      </div>

      {/* Modal de cambiar contraseña */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full animate-in scale-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Cambiar contraseña</h2>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-700">
                  {passwordError}
                </div>
              )}

              {!passwordSetByUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-blue-700">
                  Nota: Te registraste con Google Auth. Solo necesitas establecer una contraseña nueva.
                </div>
              )}

              {passwordSetByUser && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="input w-full"
                    placeholder="Ingresa tu contraseña actual"
                    disabled={passwordSaving}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input w-full"
                  placeholder="Ingresa tu nueva contraseña"
                  disabled={passwordSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input w-full"
                  placeholder="Confirma tu nueva contraseña"
                  disabled={passwordSaving}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  disabled={passwordSaving}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex-1 px-4 py-2.5 bg-wahu-500 hover:bg-wahu-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {passwordSaving ? 'Guardando...' : 'Cambiar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
