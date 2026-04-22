import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, MapPin, PawPrint, MessageCircle, CalendarDays } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';
import { AppointmentModal } from './Appointments.jsx';

// Avatar con fallback de inicial si la imagen falla
function PetAvatar({ pet, size = 'md' }) {
  const [broken, setBroken] = useState(!pet.avatar_url);
  const sz = size === 'md' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base';
  const initial = (pet.name || '?')[0].toUpperCase();

  if (broken) {
    return (
      <div className={`${sz} rounded-full bg-gradient-to-br from-wahu-400 to-orange-500 flex items-center justify-center font-bold text-white border-2 border-green-200 flex-shrink-0`}>
        {initial}
      </div>
    );
  }
  return (
    <img
      src={pet.avatar_url}
      alt={pet.name}
      className={`${sz} rounded-full object-cover border-2 border-green-200 flex-shrink-0`}
      onError={() => setBroken(true)}
    />
  );
}

export default function Hydrant() {
  const navigate = useNavigate();
  const { firstPet } = useMyPets();
  const [enabled, setEnabled] = useState(false);
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [apptTarget, setApptTarget] = useState(null);

  useEffect(() => {
    if (firstPet) setEnabled(firstPet.hydrant_enabled || false);
  }, [firstPet]);

  useEffect(() => {
    if (!enabled) return;
    setLoadingPets(true);
    api.getHydrant()
      .then(setPets)
      .catch(() => setPets([]))
      .finally(() => setLoadingPets(false));
  }, [enabled]);

  const handleToggle = async () => {
    const next = !enabled;
    setEnabled(next);
    if (firstPet) {
      try { await api.toggleHydrant(firstPet.id, next); } catch {}
    }
    if (next) {
      setLoadingPets(true);
      api.getHydrant()
        .then(setPets)
        .catch(() => setPets([]))
        .finally(() => setLoadingPets(false));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="page-header">
        <Droplets className="page-icon" />
        <h1 className="page-title">Hidrante</h1>
        <p className="page-subtitle">Encuentra mascotas cerca de ti disponibles para socializar</p>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex gap-3">
          <PawPrint size={20} className="text-wahu-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm mb-1">¿Cómo funciona el Hidrante?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cuando tu mascota "mea en el hidrante", aparece en este panel para que otros puedan encontrarla. Solo verás mascotas de otros compañeros que también hayan habilitado esta opción.
            </p>
            {!firstPet && <p className="text-xs text-amber-600 mt-2">Necesitas registrar una mascota para usar el hidrante.</p>}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleToggle}
                disabled={!firstPet}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${enabled ? 'bg-wahu-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {enabled ? 'Mi mascota está disponible' : 'Habilitar mi mascota'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!enabled ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="font-bold text-gray-800 mb-2">Hidrante deshabilitado</h2>
          <p className="text-sm text-gray-500 mb-5">Habilita el hidrante para ver otras mascotas disponibles</p>
          <button onClick={handleToggle} disabled={!firstPet} className="btn-primary mx-auto disabled:opacity-50">
            <Droplets size={18} /> Habilitar ahora
          </button>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Mascotas disponibles {!loadingPets && `(${pets.length})`}
          </h2>
          {loadingPets ? (
            <div className="flex flex-col gap-3">
              {[1,2].map(i => <div key={i} className="card h-20 animate-pulse bg-wahu-50" />)}
            </div>
          ) : pets.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">
              <Droplets size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No hay mascotas disponibles ahora</p>
              <p className="text-xs mt-1">Comparte el hidrante para que más mascotas se unan</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pets.map(pet => (
                <div key={pet.id} className="card flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <PetAvatar pet={pet} />
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/pets/${pet.username}`)}
                        className="font-semibold text-gray-800 hover:text-wahu-600 transition-colors">
                        {pet.name}
                      </button>
                      <span className="badge bg-wahu-100 text-wahu-600 text-xs">Nv.{pet.level}</span>
                    </div>
                    <p className="text-xs text-wahu-500">@{pet.username} · {pet.breed}</p>
                    {pet.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-gray-400" />
                        <p className="text-xs text-gray-400">{pet.location}</p>
                      </div>
                    )}
                    {/* Compañero como link */}
                    {pet.companion_username && (
                      <button
                        onClick={() => navigate(`/companions/${pet.companion_username}`)}
                        className="text-xs text-gray-400 hover:text-wahu-500 transition-colors mt-0.5">
                        👤 @{pet.companion_username}
                      </button>
                    )}
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {pet.tags?.filter(Boolean).map(tag => (
                        <span key={tag} className="badge bg-orange-100 text-orange-700 text-xs">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => firstPet && setApptTarget(pet)}
                      disabled={!firstPet}
                      className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all disabled:opacity-40"
                      title="Proponer cita">
                      <CalendarDays size={13} /> Cita
                    </button>
                    <button
                      onClick={() => navigate(`/chat?petId=${pet.id}`)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                      <MessageCircle size={13} /> Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {apptTarget && firstPet && (
        <AppointmentModal
          open={!!apptTarget}
          onClose={() => setApptTarget(null)}
          onCreated={() => setApptTarget(null)}
          myPet={firstPet}
          targetPet={apptTarget}
        />
      )}
    </div>
  );
}
