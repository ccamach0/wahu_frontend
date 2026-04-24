/**
 * Unified Button Text Constants
 * Standardized nomenclature across the entire application
 */

export const BUTTON_TEXT = {
  // Friendship & Pack actions
  INVITE_PACK: 'Agregar a Manada',        // Invite pet to manada (from Jauría or Explore)
  ACCEPT_FRIEND: 'Aceptar amistad',       // Accept incoming friendship request
  REMOVE_PACK: 'Remover de Manada',       // Remove from manada
  REMOVE_FRIEND: 'Eliminar de jauría',    // Remove from jauría completely
  SENT_REQUEST: 'Solicitud enviada',      // Status badge: request pending
  IN_PACK: '✓ En Manada',                 // Status badge: pet is in manada
  IN_FRIEND: '✓ Amigo',                   // Status badge: pet is a friend

  // Clan actions
  JOIN_CLAN: 'Unirse',                    // Join a clan
  CREATE_CLAN: 'Crear clan',              // Create new clan
  MEMBER: '✓ Miembro',                    // Status badge: already member

  // Card actions
  ADD_CARD: 'Agregar',                    // Add card to pet profile
  CARD_ADDED: '✓ Agregada',               // Status badge: card already added
  CREATE_CARD: 'Crear',                   // Create new card
  VOTE_CARD: '🐾',                        // Card paw vote (text-only, count added separately)

  // Appointment actions
  PROPOSE_APPT: 'Cita',                   // Propose appointment button
  SEND_APPT: '🐾 Enviar cita',            // Submit appointment form
  CONFIRM_APPT: 'Confirmar cita',         // Confirm appointment
  CANCEL_APPT: 'Cancelar cita',           // Cancel appointment
  ENABLE_HYDRANT: 'Habilitar ahora',      // Enable hydrant toggle

  // Generic actions
  SAVE: 'Guardar',                        // Save changes
  CANCEL: 'Cancelar',                     // Cancel action
  UPLOAD: 'Subir',                        // Upload file
  CREATE: 'Crear',                        // Create item
  DELETE: 'Eliminar',                     // Delete item
  SEND: 'Enviar',                         // Send message/form
  SEARCH: 'Buscar',                       // Search

  // Filter & Sort actions
  POPULAR: 'Populares',                   // Show popular items
  RANDOM: 'Aleatorio',                    // Show random items
  CLEAR_FILTERS: 'Limpiar',               // Clear search filters
};

export const BUTTON_STYLES = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'text-red-400 hover:text-red-600 border border-red-200 hover:bg-red-50',
  ghost: 'text-gray-400 hover:text-gray-600',
  small: 'text-xs py-1.5 px-3 rounded-lg',
  badge: 'text-xs py-1.5 px-3 rounded-xl font-medium',
};

/**
 * Helper function to render consistent friend status display
 */
export const getFriendStatusDisplay = (status) => {
  const statusMap = {
    friends: { text: BUTTON_TEXT.IN_FRIEND, style: 'bg-green-100 text-green-700' },
    sent: { text: BUTTON_TEXT.SENT_REQUEST, style: 'bg-amber-100 text-amber-700' },
    received: { text: BUTTON_TEXT.ACCEPT_FRIEND, style: 'btn-primary' },
    none: { text: BUTTON_TEXT.INVITE_PACK, style: 'btn-primary' },
  };
  return statusMap[status] || statusMap.none;
};
