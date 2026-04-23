import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, PawPrint, Trash2, Star, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePetContext } from '../hooks/usePetContext.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import api from '../services/api.js';

const SPECIES = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Hamster', 'Otro'];

function ConfirmModal({ pet, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h3 className="font-bold text-gray-800">Eliminar mascota</h3>
        </div>
        <p className="text-gray-600 text-sm mb-2">
          ¿Estás seguro que deseas eliminar a <strong>{pet.name}</strong>?
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Se perderá toda la información de esta mascota: perfil, tarjetas, clanes y amigos. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary text-sm py-2.5"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Companion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pets, activePet, setActivePet, addPet, removePet, loading } = usePetContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', breed: '', species: 'Perro', location: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

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
      if (imageFile) {
        data.append('image', imageFile);
      }

      const newPet = await api.createPet(data);
      addPet(newPet);
      setForm({ name: '', username: '', breed: '', species: 'Perro', location: '', bio: '' });
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {petToDelete && (
        <ConfirmModal
          pet={petToDelete}
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
        <h2 className="font-bold text-gray-800 mb-4">Mi perfil</h2>
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
      </div>

      {/* Header mis mascotas */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">Mis mascotas</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          <Plus size={16} />
          Agregar mascota
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
                <PawPrint size={16} /> {saving ? 'Creando...' : 'Crear mascota'}
              </button>
              <button type="button" className="btn-secondary text-sm py-2" onClick={() => setShowForm(false)}>
                Cancelar
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
            <div key={pet.id} className="card flex items-center gap-4 p-4">
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
                  onClick={() => setPetToDelete(pet)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
