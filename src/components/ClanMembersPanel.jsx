import { useToast } from '../hooks/useToast.jsx';
import { useState } from 'react';
import { Trash2, Shield, Users } from 'lucide-react';
import api from '../services/api.js';

export default function ClanMembersPanel({
  clanId,
  members,
  currentPetId,
  userRole,
  isAdmin,
  onMemberUpdated,
}) {
  const [updating, setUpdating] = useState({});
  const toast = useToast();
  const [selectedPetId, setSelectedPetId] = useState(null);
  const toast = useToast();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const toast = useToast();

  const handlePromoteToModerator = async (petId) => {
    try {
      setUpdating(prev => ({ ...prev, [petId]: true }));
      await api.updateClanMemberRole(clanId, petId, 'moderator');
      setSelectedPetId(null);
      setShowRoleMenu(false);
      onMemberUpdated();
    } catch (err) {
      toast.error(err.message || 'Error al cambiar rol');
    } finally {
      setUpdating(prev => ({ ...prev, [petId]: false }));
    }
  };

  const handleDemoteToMember = async (petId) => {
    try {
      setUpdating(prev => ({ ...prev, [petId]: true }));
      await api.updateClanMemberRole(clanId, petId, 'member');
      setSelectedPetId(null);
      setShowRoleMenu(false);
      onMemberUpdated();
    } catch (err) {
      toast.error(err.message || 'Error al cambiar rol');
    } finally {
      setUpdating(prev => ({ ...prev, [petId]: false }));
    }
  };

  const handleRemoveMember = async (petId) => {
    if (!confirm('¿Eliminar miembro del clan?')) return;

    try {
      setUpdating(prev => ({ ...prev, [petId]: true }));
      await api.removeClanMember(clanId, petId);
      onMemberUpdated();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar miembro');
    } finally {
      setUpdating(prev => ({ ...prev, [petId]: false }));
    }
  };

  if (!members || members.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-400">
        <Users className="mx-auto mb-2" size={24} />
        <p>No hay miembros en el clan</p>
      </div>
    );
  }

  // Separate members by role
  const admins = members.filter(m => m.role === 'admin');
  const moderators = members.filter(m => m.role === 'moderator');
  const regularMembers = members.filter(m => m.role === 'member');

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'moderator':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const MemberRow = ({ member }) => (
    <div key={member.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 transition">
      <div className="flex items-center gap-3 flex-1">
        <img
          src={member.avatar_url || 'https://placedog.net/32/32'}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{member.name}</p>
          <p className="text-xs text-gray-500">@{member.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
          {member.role === 'admin' ? 'Fundador' : member.role === 'moderator' ? 'Moderador' : 'Miembro'}
        </span>

        {/* Actions */}
        {isAdmin && member.id !== currentPetId && (
          <div className="flex gap-1">
            {member.role !== 'admin' && (
              <button
                onClick={() => {
                  if (member.role === 'member') {
                    handlePromoteToModerator(member.id);
                  } else {
                    handleDemoteToMember(member.id);
                  }
                }}
                disabled={updating[member.id]}
                className="p-1.5 hover:bg-blue-50 rounded-lg transition text-blue-500 hover:text-blue-600 disabled:opacity-50"
                title={member.role === 'member' ? 'Promover a moderador' : 'Bajar a miembro'}
              >
                <Shield size={14} />
              </button>
            )}
            {member.id !== currentPetId && admins.length > 1 && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                disabled={updating[member.id]}
                className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-500 hover:text-red-600 disabled:opacity-50"
                title="Eliminar miembro"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Admins */}
      {admins.length > 0 && (
        <div className="card overflow-hidden">
          <div className="bg-red-50 px-4 py-2 border-b">
            <p className="text-sm font-semibold text-red-700">Fundador ({admins.length})</p>
          </div>
          <div className="divide-y">
            {admins.map(member => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Moderators */}
      {moderators.length > 0 && (
        <div className="card overflow-hidden">
          <div className="bg-orange-50 px-4 py-2 border-b">
            <p className="text-sm font-semibold text-orange-700">Moderadores ({moderators.length})</p>
          </div>
          <div className="divide-y">
            {moderators.map(member => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Members */}
      {regularMembers.length > 0 && (
        <div className="card overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <p className="text-sm font-semibold text-gray-700">Miembros ({regularMembers.length})</p>
          </div>
          <div className="divide-y">
            {regularMembers.map(member => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
