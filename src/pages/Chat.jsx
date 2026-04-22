import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Search, ArrowLeft, Smile, PawPrint, Trash2, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMyPets } from '../hooks/useMyPets.jsx';
import api from '../services/api.js';

const slideIn = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.15 } },
};
const msgIn = (isMine) => ({
  hidden: { opacity: 0, y: 16, scale: 0.92, x: isMine ? 20 : -20 },
  visible: { opacity: 1, y: 0, scale: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
});
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 bg-wahu-400 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Bubble({ msg, isMine, showAvatar }) {
  const time = new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  const avatarSrc = msg.sender_avatar || 'https://placedog.net/32/32';
  return (
    <motion.div variants={msgIn(isMine)} initial="hidden" animate="visible"
      className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>

      {showAvatar ? (
        <img src={avatarSrc} alt={msg.sender_name}
          className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 mb-0.5"
          onError={e => { e.target.src = 'https://placedog.net/32/32'; }} />
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}

      <div className={`group max-w-xs lg:max-w-sm flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Nombre del remitente en cada burbuja */}
        <p className={`text-xs px-1 mb-0.5 ${isMine ? 'text-right text-gray-400' : 'text-gray-500'}`}>
          <span className="font-medium">{msg.sender_name}</span>
        </p>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${msg.sent_as_owner
            ? 'bg-gray-100 text-gray-700 border border-gray-200'
            : 'bg-gradient-to-br from-wahu-500 to-wahu-600 text-white'
          }
          ${isMine ? 'rounded-br-md' : 'rounded-bl-md'}`}>
          {msg.content}
        </div>
        <p className={`text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${isMine ? 'text-right' : ''}`}>
          {time}{isMine && msg.read ? ' · Visto' : ''}
        </p>
      </div>
    </motion.div>
  );
}

function ConvItem({ conv, active, onClick }) {
  const time = conv.last_message_at
    ? new Date(conv.last_message_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <motion.button variants={fadeUp} initial="hidden" animate="visible"
      onClick={onClick} whileHover={{ x: 4 }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors rounded-xl mx-1
        ${active ? 'bg-wahu-500/10 border border-wahu-200' : 'hover:bg-gray-50'}`}>
      <div className="relative flex-shrink-0">
        <img src={conv.other_avatar || `https://placedog.net/48/48?id=${conv.other_id}`}
          alt={conv.other_name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          onError={e => { e.target.src = 'https://placedog.net/48/48'; }} />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className={`font-semibold text-sm truncate ${active ? 'text-wahu-600' : 'text-gray-800'}`}>
            {conv.other_name}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {conv.last_message || 'Nueva conversación'}
        </p>
      </div>
      {parseInt(conv.unread_count) > 0 && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          className="w-5 h-5 bg-wahu-500 text-white text-xs rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {conv.unread_count}
        </motion.span>
      )}
    </motion.button>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}>
        <div className="w-24 h-24 bg-wahu-50 rounded-3xl flex items-center justify-center shadow-inner">
          <PawPrint size={44} className="text-wahu-300" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="text-center px-8">
        <p className="font-semibold text-gray-600 text-lg">Selecciona un chat</p>
        <p className="text-sm mt-1 text-gray-400">
          Inicia nuevas conversaciones desde el{' '}
          <span className="text-wahu-500 font-medium">Hidrante</span> o tu{' '}
          <span className="text-wahu-500 font-medium">Manada/Jauría</span>
        </p>
      </motion.div>
    </div>
  );
}

function NoPetState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 p-8">
      <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center">
        <PawPrint size={40} className="text-wahu-300" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-600 text-lg">Sin mascota activa</p>
        <p className="text-sm mt-1">Registra una mascota en <span className="text-wahu-500 font-medium">Mis Mascotas</span> para poder chatear</p>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user } = useAuth();
  const { firstPet, loading: petsLoading } = useMyPets();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);
  const lastMsgTime = useRef(null);

  const loadConversations = useCallback(async (petId) => {
    try {
      const convs = await api.getConversations(petId);
      setConversations(convs);
      return convs;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    setActiveConv(null);
    setMessages([]);
    clearInterval(pollRef.current);
    setInitialized(false);
    loadConversations(firstPet?.id).then(() => setInitialized(true));
  }, [firstPet?.id]);

  // Abrir conversación desde URL param (?petId=xxx)
  useEffect(() => {
    if (!initialized || !firstPet) return;
    const params = new URLSearchParams(window.location.search);
    const petId = params.get('petId');
    if (petId) {
      window.history.replaceState({}, '', '/chat');
      startChatWithPet(petId);
    }
  }, [initialized, firstPet?.id]);

  const openConversation = useCallback(async (conv) => {
    setActiveConv(conv);
    setLoadingMsgs(true);
    setMessages([]);
    clearInterval(pollRef.current);
    try {
      const msgs = await api.getMessages(conv.id);
      setMessages(msgs);
      lastMsgTime.current = msgs.at(-1)?.created_at ?? new Date().toISOString();
      loadConversations(conv.my_pet_id);
    } finally {
      setLoadingMsgs(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    pollRef.current = setInterval(async () => {
      try {
        const since = lastMsgTime.current;
        const newMsgs = await api.getMessages(conv.id, since);
        if (newMsgs.length > 0) {
          setMessages(prev => {
            const ids = new Set(prev.map(m => m.id));
            const fresh = newMsgs.filter(m => !ids.has(m.id));
            return fresh.length ? [...prev, ...fresh] : prev;
          });
          lastMsgTime.current = newMsgs.at(-1).created_at;
          loadConversations(conv.my_pet_id);
        }
      } catch {}
    }, 3000);
  }, [loadConversations]);

  useEffect(() => () => clearInterval(pollRef.current), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: messages.length < 5 ? 'instant' : 'smooth' });
  }, [messages]);

  const deleteConversation = async (convId) => {
    if (!confirm('¿Eliminar esta conversación? Se borrarán todos los mensajes.')) return;
    try {
      await api.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      setActiveConv(null);
      clearInterval(pollRef.current);
      setMessages([]);
    } catch {}
  };

  const startChatWithPet = async (petId) => {
    try {
      const { id } = await api.startConversation(petId);
      const convs = await loadConversations(firstPet?.id);
      const conv = convs.find(c => c.id === id);
      if (conv) openConversation(conv);
    } catch (e) {
      console.error('Error al iniciar chat:', e);
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !activeConv || sending || !firstPet) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    const myPetId = activeConv.my_pet_id;
    const tempMsg = {
      id: `temp-${Date.now()}`,
      content: text,
      sender_id: myPetId,
      sender_name: sendAsOwner ? user.name : firstPet.name,
      sender_avatar: sendAsOwner ? user.avatar_url : firstPet.avatar_url,
      sent_as_owner: sendAsOwner,
      created_at: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const saved = await api.sendMessage(activeConv.id, text, sendAsOwner);
      lastMsgTime.current = saved.created_at;
      setMessages(prev => {
        const seen = new Set();
        return prev
          .map(m => m.id === tempMsg.id ? saved : m)
          .filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
      });
      loadConversations(activeConv.my_pet_id);
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter(c =>
    c.other_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.other_username?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = messages.map((m, i) => ({
    ...m,
    showAvatar: i === 0 || messages[i - 1]?.sender_id !== m.sender_id,
  }));

  if (petsLoading) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="w-8 h-8 border-2 border-wahu-200 border-t-wahu-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-50 overflow-hidden">

      {/* Panel izquierdo: Lista de chats — se oculta en móvil cuando hay conversación activa */}
      <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col
          ${activeConv ? 'hidden lg:flex lg:w-80' : 'flex w-full lg:w-80'}`}>

        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mensajes</h2>
            {firstPet && (
              <div className="flex items-center gap-2 bg-wahu-50 px-3 py-1.5 rounded-xl">
                <img src={firstPet.avatar_url || 'https://placedog.net/24/24'}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={e => { e.target.src = 'https://placedog.net/24/24'; }} />
                <span className="text-xs font-semibold text-wahu-600 truncate max-w-[80px]">{firstPet.name}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-wahu-300"
              placeholder="Filtrar chats..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
          <AnimatePresence>
            {!firstPet ? (
              <motion.div variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm text-center px-4">
                <PawPrint size={32} className="mb-3 opacity-30" />
                <p>Registra una mascota para chatear</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm text-center px-4">
                <MessageCircle size={32} className="mb-3 opacity-30" />
                <p>Sin conversaciones</p>
                <p className="text-xs mt-2 text-gray-400">
                  Inicia chats desde el Hidrante o tu Manada
                </p>
              </motion.div>
            ) : filtered.map(conv => (
              <ConvItem key={conv.id} conv={conv}
                active={activeConv?.id === conv.id}
                onClick={() => openConversation(conv)} />
            ))}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Panel derecho: Ventana de chat — solo visible en móvil cuando hay conversación */}
      <div className={`flex-1 flex-col min-w-0 ${activeConv ? 'flex' : 'hidden lg:flex'}`}>
        <AnimatePresence mode="wait">
          {!firstPet ? (
            <motion.div key="nopet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex">
              <NoPetState />
            </motion.div>
          ) : !activeConv ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex">
              <EmptyChat />
            </motion.div>
          ) : (
            <motion.div key={activeConv.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0">

              {/* Header */}
              <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3 shadow-sm">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setActiveConv(null); clearInterval(pollRef.current); }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
                  <ArrowLeft size={18} />
                </motion.button>
                <div className="relative">
                  <img src={activeConv.other_avatar || 'https://placedog.net/40/40'}
                    alt={activeConv.other_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-wahu-100 shadow-sm"
                    onError={e => { e.target.src = 'https://placedog.net/40/40'; }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{activeConv.other_name}</p>
                  <p className="text-xs text-gray-500">@{activeConv.other_username}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => deleteConversation(activeConv.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                  title="Eliminar conversación">
                  <Trash2 size={16} />
                </motion.button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2"
                style={{ background: 'linear-gradient(180deg, #FFF5F0 0%, #FAFAFA 100%)' }}>
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-wahu-200 border-t-wahu-500 rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      <Smile size={32} className="text-wahu-300" />
                    </div>
                    <p className="text-sm">¡Di hola! 👋</p>
                  </motion.div>
                ) : (
                  grouped.map(msg => (
                    <Bubble key={msg.id} msg={msg}
                      isMine={msg.sender_id === activeConv?.my_pet_id}
                      showAvatar={msg.showAvatar} />
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <motion.form onSubmit={sendMessage}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white border-t border-gray-100 px-4 pt-2 pb-3 flex flex-col gap-2">

                {/* Toggle enviar como mascota / dueño */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Enviando como:</span>
                  <button type="button"
                    onClick={() => setSendAsOwner(false)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${!sendAsOwner ? 'bg-wahu-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    <img src={firstPet.avatar_url || 'https://placedog.net/20/20'}
                      className="w-4 h-4 rounded-full object-cover"
                      onError={e => { e.target.src = 'https://placedog.net/20/20'; }} />
                    {firstPet.name}
                  </button>
                  <button type="button"
                    onClick={() => setSendAsOwner(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${sendAsOwner ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    <User size={12} />
                    {user?.name || 'Dueño'}
                  </button>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-wahu-400 focus:bg-white transition-all resize-none max-h-28 leading-relaxed"
                      placeholder={sendAsOwner ? `Escribe como ${user?.name || 'dueño'}...` : `Escribe como ${firstPet.name}...`}
                      rows={1}
                      value={input}
                      onChange={e => {
                        setInput(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                      }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || sending}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className={`w-11 h-11 text-white rounded-2xl flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-all ${sendAsOwner ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 'bg-gradient-to-br from-wahu-500 to-wahu-600'}`}>
                    <Send size={18} className={sending ? 'opacity-60' : ''} />
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
