import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import api from '../services/api.js';

export default function ClanChatWidget({
  clanId,
  firstPet,
  user,
}) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sendAsOwner, setSendAsOwner] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    loadMessages();

    // Refresh messages every 10 seconds, but only if not already loading
    const interval = setInterval(() => {
      if (!isLoadingRef.current && !sending) {
        loadMessages();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [clanId]); // Only depend on clanId

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    // Prevent concurrent requests
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setLoading(true);
      const data = await api.getClanMessages(clanId);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || sending || isLoadingRef.current) return;

    setSending(true);
    try {
      const newMessage = await api.sendClanMessage(clanId, messageText, sendAsOwner);
      setMessages([...messages, newMessage]);
      setMessageText('');
      // Reset to sending as pet by default
      setSendAsOwner(false);
    } catch (err) {
      alert(err.message || 'Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="card p-4 max-h-96 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            Sin mensajes aún
          </p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="flex gap-2">
              <img
                src={message.author_avatar || 'https://placedog.net/24/24'}
                alt={message.author_name}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs font-medium text-gray-800">
                    {message.author_name}
                  </p>
                  {message.author_owner_name && (
                    <span className="text-xs text-gray-500">
                      ({message.author_owner_name})
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      {firstPet && (
        <form onSubmit={handleSendMessage} className="card p-4">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSendAsOwner(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition ${
                !sendAsOwner
                  ? 'bg-wahu-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <img
                src={firstPet?.avatar_url}
                className="w-4 h-4 rounded-full"
                alt={firstPet?.name}
              />
              {firstPet?.name}
            </button>
            <button
              type="button"
              onClick={() => setSendAsOwner(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition ${
                sendAsOwner
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {user?.name}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="input flex-1 text-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="btn-primary p-2 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
