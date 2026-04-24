import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Image, LogOut, Trash2, Shield } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMyPets } from '../hooks/useMyPets.jsx';
import ClanPostsSection from '../components/ClanPostsSection.jsx';
import ClanGallerySection from '../components/ClanGallerySection.jsx';
import ClanMembersPanel from '../components/ClanMembersPanel.jsx';
import ClanChatWidget from '../components/ClanChatWidget.jsx';

export default function ClanProfile() {
  const { clanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { firstPet } = useMyPets();
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [userRole, setUserRole] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const previousPetIdRef = useRef(null);

  useEffect(() => {
    loadClan();
  }, [clanId, firstPet]);

  // Redirigir si cambió la mascota y la nueva no es miembro
  useEffect(() => {
    if (!loading && firstPet) {
      // Si la mascota cambió y no es miembro, redirigir
      if (previousPetIdRef.current && previousPetIdRef.current !== firstPet.id && !isMember) {
        navigate('/clans', { replace: true });
      }
      // Actualizar la mascota anterior solo si fue cargada
      previousPetIdRef.current = firstPet.id;
    }
  }, [isMember, loading, firstPet, navigate]);

  const loadClan = async () => {
    if (!clanId) return;
    try {
      setLoading(true);
      const data = await api.getClan(clanId);
      setClan(data);
      setMembers(data.members || []);
      setHasPendingRequest(!!data.userPendingRequest);

      // Determine user's role in clan
      if (firstPet && data.members) {
        const userMember = data.members.find(m => m.id === firstPet.id);
        if (userMember) {
          setIsMember(true);
          setUserRole(userMember.role);
        } else {
          setIsMember(false);
          setUserRole(null);
        }
      } else {
        setIsMember(false);
        setUserRole(null);
      }
    } catch (err) {
      console.error('Error loading clan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClan = async () => {
    const confirmed = window.confirm(
      '⚠️  Vas a salir del clan "' + clan.name + '"\n\nEsta acción es irreversible. ¿Estás seguro?'
    );
    if (!confirmed) return;

    try {
      await api.leaveClan(clanId);
      navigate('/clans');
    } catch (err) {
      alert(err.message || 'Error al salir del clan');
    }
  };

  const handleDeleteClan = async () => {
    const confirmed = window.confirm(
      '⚠️  ¡ADVERTENCIA! Vas a ELIMINAR el clan "' + clan.name + '" de forma permanente.\n\nTodos los posts, galería, mensajes y miembros serán eliminados.\n\n¿Estás completamente seguro?'
    );
    if (!confirmed) return;

    try {
      await api.deleteClan(clanId);
      navigate('/clans');
    } catch (err) {
      alert(err.message || 'Error al eliminar el clan');
    }
  };

  const handleJoinClan = async () => {
    if (!firstPet) {
      alert('Necesitas una mascota para solicitar acceso al clan');
      return;
    }

    try {
      await api.joinClan(clanId, firstPet.id);
      alert('Solicitud de acceso enviada. Espera la aceptación de un moderador.');
      loadClan();
    } catch (err) {
      alert(err.message || 'Error al solicitar acceso');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="space-y-4 px-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!clan) {
    return <div className="text-center py-8 text-gray-500">Clan no encontrado</div>;
  }

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;

  return (
    <div className="pb-20">
      {/* Clan Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            {clan.avatar_url && (
              <img
                src={clan.avatar_url}
                alt={clan.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{clan.name}</h1>
              <p className="text-xs text-gray-500">
                {clan.member_count || 0} miembros
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={handleDeleteClan}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                title="Eliminar clan"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            )}
            {isMember && !isAdmin && (
              <button
                onClick={handleLeaveClan}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition flex items-center gap-2"
                title="Salir del clan"
              >
                <LogOut size={16} />
                Salir
              </button>
            )}
            {!isMember && hasPendingRequest && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                ⏳ Solicitud pendiente
              </span>
            )}
            {!isMember && !hasPendingRequest && (
              <button
                onClick={handleJoinClan}
                className="px-3 py-1 bg-wahu-500 text-white rounded-lg text-sm font-medium hover:bg-wahu-600 transition"
              >
                Solicitar acceso
              </button>
            )}
          </div>

          {clan.description && (
            <p className="text-sm text-gray-600 mb-4">{clan.description}</p>
          )}

          {/* Tabs */}
          {isMember && (
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 border-t pt-3">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeTab === 'posts'
                    ? 'bg-wahu-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={14} />
                Publicaciones
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeTab === 'gallery'
                    ? 'bg-wahu-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Image size={14} />
                Galería
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeTab === 'members'
                    ? 'bg-wahu-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users size={14} />
                Miembros
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeTab === 'chat'
                    ? 'bg-wahu-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={14} />
                Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {!isMember ? (
          <div className="text-center py-8">
            <Users className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-600 mb-4">Necesitas ser miembro para ver el contenido del clan</p>
            <button
              onClick={handleJoinClan}
              className="px-4 py-2 bg-wahu-500 text-white rounded-lg font-medium hover:bg-wahu-600 transition"
            >
              Unirse al clan
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'posts' && (
              <ClanPostsSection
                clanId={clanId}
                firstPet={firstPet}
                user={user}
                userRole={userRole}
                isModerator={isModerator}
                onContentUpdated={loadClan}
              />
            )}
            {activeTab === 'gallery' && (
              <ClanGallerySection
                clanId={clanId}
                firstPet={firstPet}
                user={user}
                userRole={userRole}
                isModerator={isModerator}
                onContentUpdated={loadClan}
              />
            )}
            {activeTab === 'members' && (
              <ClanMembersPanel
                clanId={clanId}
                members={members}
                currentPetId={firstPet?.id}
                userRole={userRole}
                isAdmin={isAdmin}
                onMemberUpdated={loadClan}
              />
            )}
            {activeTab === 'chat' && (
              <ClanChatWidget
                clanId={clanId}
                firstPet={firstPet}
                user={user}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
