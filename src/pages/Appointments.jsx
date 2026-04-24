import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Plus, Check, X, Trash2, PawPrint, ChevronLeft, ChevronRight, List } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';
import { BUTTON_TEXT } from '../constants/buttonText.js';

export const APPOINTMENT_TYPES = [
  { key: 'paseo',     label: 'Paseo',      emoji: '🦮', color: 'bg-green-100 text-green-700' },
  { key: 'caminata',  label: 'Caminata',   emoji: '🥾', color: 'bg-teal-100 text-teal-700' },
  { key: 'encuentro', label: 'Encuentro',  emoji: '🐾', color: 'bg-orange-100 text-orange-700' },
  { key: 'jugueteo',  label: 'Jugueteo',   emoji: '🎾', color: 'bg-purple-100 text-purple-700' },
  { key: 'sniffdate', label: 'Sniff Date', emoji: '👃', color: 'bg-pink-100 text-pink-700' },
];

function TypeBadge({ type, size = 'sm' }) {
  const t = APPOINTMENT_TYPES.find(t => t.key === type) || APPOINTMENT_TYPES[0];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-medium ${t.color} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      {t.emoji} {t.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };
  const label = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || map.pending}`}>
      {label[status] || status}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('es', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

// Modal para crear una cita
export function AppointmentModal({ open, onClose, onCreated, myPet, targetPet }) {
  const [type, setType] = useState('paseo');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setType('paseo'); setDate(''); setLocation(''); setNotes(''); setError(''); }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!date) return setError('Selecciona una fecha y hora');
    setSaving(true);
    setError('');
    try {
      const appt = await api.createAppointment({
        requester_pet_id: myPet.id,
        invited_pet_id: targetPet.id,
        type,
        scheduled_at: new Date(date).toISOString(),
        location: location || null,
        notes: notes || null,
      });
      onCreated?.(appt);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al crear la cita');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-gradient-to-br from-wahu-500 to-orange-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-lg">Nueva cita</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                <img src={myPet.avatar_url || 'https://placedog.net/28/28'}
                  className="w-6 h-6 rounded-full object-cover border border-white/50"
                  onError={e => { e.target.src = 'https://placedog.net/28/28'; }} />
                <span className="font-medium">{myPet.name}</span>
              </div>
              <span className="text-white/70">→</span>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                <img src={targetPet.avatar_url || 'https://placedog.net/28/28'}
                  className="w-6 h-6 rounded-full object-cover border border-white/50"
                  onError={e => { e.target.src = 'https://placedog.net/28/28'; }} />
                <span className="font-medium">{targetPet.name}</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tipo de cita</label>
              <div className="grid grid-cols-5 gap-1.5">
                {APPOINTMENT_TYPES.map(t => (
                  <button key={t.key} type="button"
                    onClick={() => setType(t.key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-xs font-medium
                      ${type === t.key ? 'border-wahu-500 bg-wahu-50' : 'border-gray-100 hover:border-wahu-200'}`}>
                    <span className="text-xl">{t.emoji}</span>
                    <span className="leading-none text-center text-gray-600">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha y hora */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Fecha y hora
              </label>
              <input type="datetime-local" required min={minDate}
                className="input w-full"
                value={date}
                onChange={e => setDate(e.target.value)} />
            </div>

            {/* Lugar (opcional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Lugar <span className="font-normal normal-case text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Parque, plaza, dirección..." maxLength={200}
                  className="input w-full pl-8"
                  value={location}
                  onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            {/* Notas (opcional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Notas <span className="font-normal normal-case text-gray-400">(opcional)</span>
              </label>
              <textarea rows={2} placeholder="Traer agua, correa larga..." maxLength={300}
                className="input w-full resize-none"
                value={notes}
                onChange={e => setNotes(e.target.value)} />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="btn-secondary flex-1">
                {BUTTON_TEXT.CANCEL}
              </button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50">
                {saving ? 'Enviando...' : BUTTON_TEXT.SEND_APPT}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Calendario mensual
function MiniCalendar({ appointments, selectedDay, onDayClick }) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Mapa: "Y-M-D" → lista de citas ese día
  const apptMap = {};
  for (const a of appointments) {
    if (a.status === 'cancelled') continue;
    const d = new Date(a.scheduled_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!apptMap[key]) apptMap[key] = [];
    apptMap[key].push(a);
  }

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = viewDate.toLocaleString('es', { month: 'long', year: 'numeric' });

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-sm text-gray-800 capitalize">{monthLabel}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
          <span key={d} className="py-1 font-medium">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${year}-${month}-${day}`;
          const dayAppts = apptMap[key] || [];
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isSel = selectedDay?.getFullYear() === year && selectedDay?.getMonth() === month && selectedDay?.getDate() === day;
          const typeColors = {
            paseo: 'bg-green-400', caminata: 'bg-teal-400', encuentro: 'bg-orange-400',
            jugueteo: 'bg-purple-400', sniffdate: 'bg-pink-400',
          };
          return (
            <button key={i} onClick={() => onDayClick(isSel ? null : new Date(year, month, day))}
              className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-all text-xs font-medium
                ${isSel ? 'bg-wahu-500 text-white shadow-md' : isToday ? 'bg-wahu-100 text-wahu-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
              {day}
              {dayAppts.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 justify-center flex-wrap">
                  {dayAppts.slice(0, 3).map((a, j) => (
                    <span key={j} className={`w-1 h-1 rounded-full ${isSel ? 'bg-white/80' : typeColors[a.type] || 'bg-wahu-400'}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1.5 capitalize">
            {selectedDay.toLocaleString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {(apptMap[`${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`] || []).length === 0 ? (
            <p className="text-xs text-gray-400">Sin citas este día</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {(apptMap[`${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`] || []).map(a => {
                const t = APPOINTMENT_TYPES.find(t => t.key === a.type) || APPOINTMENT_TYPES[0];
                const time = new Date(a.scheduled_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
                const other = a.requester_name;
                return (
                  <div key={a.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-2.5 py-1.5">
                    <span>{t.emoji}</span>
                    <span className="font-medium text-gray-700">{t.label}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{time}</span>
                    {a.location && <><span className="text-gray-400">·</span><span className="text-gray-500 truncate max-w-24">{a.location}</span></>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Página principal
export default function Appointments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { firstPet, loading: petsLoading } = useMyPets();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!firstPet) { setLoading(false); return; }
    setLoading(true);
    api.getAppointments(firstPet.id)
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [firstPet?.id]);

  // Abrir modal si viene con ?with=petId desde otro lugar
  useEffect(() => {
    if (searchParams.get('with')) setShowModal(true);
  }, []);

  const now = new Date();
  const upcoming = appointments.filter(a =>
    new Date(a.scheduled_at) >= now && a.status !== 'cancelled'
  );
  const past = appointments.filter(a =>
    new Date(a.scheduled_at) < now || a.status === 'cancelled'
  );

  const handleStatusChange = async (appt, newStatus) => {
    try {
      const updated = await api.updateAppointment(appt.id, newStatus);
      setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch {}
  };

  const handleDelete = async (appt) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await api.deleteAppointment(appt.id);
      setAppointments(prev => prev.filter(a => a.id !== appt.id));
    } catch {}
  };

  const isRequester = (appt) => firstPet && appt.requester_pet_id === firstPet.id;
  const otherPet = (appt) => isRequester(appt)
    ? { name: appt.invited_name, avatar: appt.invited_avatar, username: appt.invited_username }
    : { name: appt.requester_name, avatar: appt.requester_avatar, username: appt.requester_username };

  const list = tab === 'upcoming' ? upcoming : past;

  if (petsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-wahu-200 border-t-wahu-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="page-header">
        <CalendarDays className="page-icon" />
        <h1 className="page-title">Citas</h1>
        <p className="page-subtitle">Paseos, caminatas y encuentros con amigos</p>
      </div>

      {!firstPet ? (
        <div className="card p-10 text-center text-gray-400">
          <PawPrint size={40} className="mx-auto mb-3 opacity-30" />
          <p>Necesitas registrar una mascota para gestionar citas</p>
        </div>
      ) : (
        <>
          {/* Tabs + toggle vista + botón nuevo */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {viewMode === 'list' && (
              <div className="flex bg-white rounded-xl border border-wahu-100 p-1 flex-1 min-w-0">
                {[
                  { key: 'upcoming', label: `Próximas (${upcoming.length})` },
                  { key: 'past', label: `Historial (${past.length})` },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all truncate ${tab === key ? 'bg-wahu-500 text-white' : 'text-gray-500 hover:text-wahu-500'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            {viewMode === 'calendar' && <div className="flex-1" />}
            {/* Toggle lista/calendario */}
            <div className="flex bg-white rounded-xl border border-wahu-100 p-1 gap-1 flex-shrink-0">
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-wahu-500 text-white' : 'text-gray-400 hover:text-wahu-500'}`}
                title="Vista lista">
                <List size={15} />
              </button>
              <button onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-wahu-500 text-white' : 'text-gray-400 hover:text-wahu-500'}`}
                title="Vista calendario">
                <CalendarDays size={15} />
              </button>
            </div>
            <button onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-1.5 py-2.5 px-4 flex-shrink-0">
              <Plus size={16} /> Nueva
            </button>
          </div>

          {/* Vista calendario */}
          {viewMode === 'calendar' && (
            <MiniCalendar
              appointments={appointments}
              selectedDay={selectedDay}
              onDayClick={setSelectedDay}
            />
          )}

          {/* Lista de citas */}
          {viewMode === 'list' && (loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map(i => <div key={i} className="card h-24 animate-pulse bg-wahu-50" />)}
            </div>
          ) : list.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p>{tab === 'upcoming' ? 'No hay citas próximas' : 'Sin historial de citas'}</p>
              {tab === 'upcoming' && (
                <p className="text-xs mt-1">Propón una desde tu <span className="text-wahu-500">Manada</span> o el <span className="text-wahu-500">Hidrante</span></p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map(appt => {
                const other = otherPet(appt);
                const iAm = isRequester(appt);
                return (
                  <motion.div key={appt.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="card p-4 flex gap-3">
                    <img src={other.avatar || 'https://placedog.net/48/48'}
                      alt={other.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-wahu-100 flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/pets/${other.username}`)}
                      onError={e => { e.target.src = 'https://placedog.net/48/48'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <button className="font-semibold text-gray-800 hover:text-wahu-600 transition-colors text-sm"
                            onClick={() => navigate(`/pets/${other.username}`)}>
                            {other.name}
                          </button>
                          <span className="text-xs text-gray-400 ml-2">{iAm ? 'Tú propusiste' : 'Te invitaron'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <TypeBadge type={appt.type} />
                          <StatusBadge status={appt.status} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {formatDate(appt.scheduled_at)}
                        </span>
                        {appt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {appt.location}
                          </span>
                        )}
                      </div>
                      {appt.notes && (
                        <p className="text-xs text-gray-400 mt-1 italic">"{appt.notes}"</p>
                      )}

                      {/* Acciones */}
                      {appt.status === 'pending' && (
                        <div className="flex gap-2 mt-2.5">
                          {!iAm && (
                            <button onClick={() => handleStatusChange(appt, 'confirmed')}
                              className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-xl transition-colors font-medium">
                              <Check size={12} /> Confirmar
                            </button>
                          )}
                          <button onClick={() => handleStatusChange(appt, 'cancelled')}
                            className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl transition-colors font-medium">
                            <X size={12} /> {iAm ? 'Cancelar' : 'Rechazar'}
                          </button>
                        </div>
                      )}
                      {appt.status === 'confirmed' && iAm && (
                        <button onClick={() => handleStatusChange(appt, 'cancelled')}
                          className="mt-2.5 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                          <X size={12} /> Cancelar cita
                        </button>
                      )}
                    </div>
                    <button onClick={() => handleDelete(appt)}
                      className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-400 rounded-lg transition-colors self-start flex-shrink-0"
                      title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </>
      )}

      {/* Modal de nueva cita desde esta página (sin target pre-definido) */}
      {showModal && firstPet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Nueva cita</h2>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Propón citas directamente desde tu <span className="text-wahu-500 font-medium cursor-pointer"
                onClick={() => { setShowModal(false); navigate('/pack'); }}>Manada/Jauría</span> o el{' '}
              <span className="text-wahu-500 font-medium cursor-pointer"
                onClick={() => { setShowModal(false); navigate('/hydrant'); }}>Hidrante</span>.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1"
                onClick={() => { setShowModal(false); navigate('/pack'); }}>
                🐺 Ir a Manada
              </button>
              <button className="btn-secondary flex-1"
                onClick={() => { setShowModal(false); navigate('/hydrant'); }}>
                💧 Ir a Hidrante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
