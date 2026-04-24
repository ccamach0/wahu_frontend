const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('wahu_token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getHeadersWithContentType = () => {
  const token = localStorage.getItem('wahu_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (path, options = {}) => {
  const headers = options.body instanceof FormData ? getHeaders() : getHeadersWithContentType();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    const error = new Error(err.error || 'Error');
    error.code = err.code;
    error.data = err;
    throw error;
  }
  return res.json();
};

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  googleAuth: (access_token) => request('/auth/google', { method: 'POST', body: JSON.stringify({ access_token }) }),
  verifyEmail: (token) => request(`/auth/verify/${token}`),
  resendVerification: (email) => request('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  setActivePet: (pet_id) => request('/auth/active-pet', { method: 'PUT', body: JSON.stringify({ pet_id }) }),

  // Pets
  getPets: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/pets?${q}`);
  },
  getPopularPets: () => request('/pets/popular'),
  getPet: (username) => request(`/pets/${username}`),
  createPet: (data) => request('/pets', { method: 'POST', body: data }),
  getMyPets: () => request('/pets/my/pets'),
  deletePet: (id) => request(`/pets/${id}`, { method: 'DELETE' }),
  updatePetAvatar: (id, data) => request(`/pets/${id}/avatar`, { method: 'PUT', body: data }),

  // Pet Gallery
  uploadPetGalleryImage: (petId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/pets/${petId}/gallery`, { method: 'POST', body: formData });
  },
  getPetGallery: (petId, limit = 10, offset = 0) =>
    request(`/pets/${petId}/gallery?limit=${limit}&offset=${offset}`),
  deletePetGalleryImage: (petId, imageId) =>
    request(`/pets/${petId}/gallery/${imageId}`, { method: 'DELETE' }),
  reorderPetGallery: (petId, imageIds) =>
    request(`/pets/${petId}/gallery/reorder`, { method: 'PUT', body: JSON.stringify({ imageIds }) }),

  // Cards
  getCards: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/cards?${q}`);
  },
  createCard: (data) => request('/cards', { method: 'POST', body: JSON.stringify(data) }),
  pawCard: (id, pet_id) => request(`/cards/${id}/paw`, { method: 'POST', body: JSON.stringify({ pet_id }) }),
  addCardToPet: (id, pet_id) => request(`/cards/${id}/add-to-pet`, { method: 'POST', body: JSON.stringify({ pet_id }) }),
  likeCard: (id, pet_id) => request(`/cards/${id}/like`, { method: 'POST', body: JSON.stringify({ pet_id }) }),
  unlikeCard: (id, pet_id) => request(`/cards/${id}/like`, { method: 'DELETE', body: JSON.stringify({ pet_id }) }),

  // Clans
  getClans: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/clans?${q}`);
  },
  getClan: (id) => request(`/clans/${id}`),
  createClan: (data) => request('/clans', { method: 'POST', body: JSON.stringify(data) }),
  joinClan: (id, pet_id) => request(`/clans/${id}/join`, { method: 'POST', body: JSON.stringify({ pet_id }) }),
  getMyClans: (pet_id) => request(`/clans/my/${pet_id}`),

  // Clan Member Management
  updateClanMemberRole: (clanId, petId, role) =>
    request(`/clans/${clanId}/members/${petId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }),
  removeClanMember: (clanId, petId) =>
    request(`/clans/${clanId}/members/${petId}`, { method: 'DELETE' }),
  leaveClan: (clanId) =>
    request(`/clans/${clanId}/leave`, { method: 'POST' }),
  deleteClan: (clanId) =>
    request(`/clans/${clanId}`, { method: 'DELETE' }),

  // Clan Join Requests
  getClanJoinRequests: (clanId) =>
    request(`/clans/${clanId}/requests`),
  approveClanRequest: (clanId, requestId) =>
    request(`/clans/${clanId}/requests/${requestId}/approve`, { method: 'POST' }),
  rejectClanRequest: (clanId, requestId) =>
    request(`/clans/${clanId}/requests/${requestId}/reject`, { method: 'POST' }),

  // Clan Posts
  getClanPosts: (clanId, limit = 20, offset = 0) =>
    request(`/clans/${clanId}/posts?limit=${limit}&offset=${offset}`),
  createClanPost: (clanId, content, sent_as_owner = false) =>
    request(`/clans/${clanId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteClanPost: (clanId, postId) =>
    request(`/clans/${clanId}/posts/${postId}`, { method: 'DELETE' }),

  // Clan Post Comments
  getClanPostComments: (clanId, postId, limit = 50, offset = 0) =>
    request(`/clans/${clanId}/posts/${postId}/comments?limit=${limit}&offset=${offset}`),
  createClanPostComment: (clanId, postId, content, sent_as_owner = false) =>
    request(`/clans/${clanId}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteClanPostComment: (clanId, postId, commentId) =>
    request(`/clans/${clanId}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Clan Gallery
  uploadClanGalleryImage: (clanId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/clans/${clanId}/gallery`, { method: 'POST', body: formData });
  },
  getClanGallery: (clanId, limit = 20, offset = 0) =>
    request(`/clans/${clanId}/gallery?limit=${limit}&offset=${offset}`),
  deleteClanGalleryImage: (clanId, imageId) =>
    request(`/clans/${clanId}/gallery/${imageId}`, { method: 'DELETE' }),

  // Clan Gallery Comments
  getClanGalleryComments: (clanId, imageId, limit = 50, offset = 0) =>
    request(`/clans/${clanId}/gallery/${imageId}/comments?limit=${limit}&offset=${offset}`),
  createClanGalleryComment: (clanId, imageId, content, sent_as_owner = false) =>
    request(`/clans/${clanId}/gallery/${imageId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteClanGalleryComment: (clanId, imageId, commentId) =>
    request(`/clans/${clanId}/gallery/${imageId}/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Clan Chat
  getClanMessages: (clanId, limit = 50, offset = 0) =>
    request(`/clans/${clanId}/messages?limit=${limit}&offset=${offset}`),
  sendClanMessage: (clanId, content, sent_as_owner = false) =>
    request(`/clans/${clanId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),

  // Friendships
  getFriendships: (petId) => request(`/friendships/${petId}`),
  getPendingRequests: (petId) => request(`/friendships/pending/${petId}`),
  getSentRequests: (petId) => request(`/friendships/sent/${petId}`),
  sendFriendRequest: (data) => request('/friendships/request', { method: 'POST', body: JSON.stringify(data) }),
  cancelFriendRequest: (id) => request(`/friendships/${id}`, { method: 'DELETE' }),
  acceptFriendRequest: (id) => request(`/friendships/${id}/accept`, { method: 'PUT' }),
  rejectFriendRequest: (id) => request(`/friendships/${id}/reject`, { method: 'PUT' }),
  addToManada: (petId, friendId) => request(`/friendships/${petId}/manada/${friendId}`, { method: 'POST' }),
  removeFromManada: (petId, friendId) => request(`/friendships/${petId}/manada/${friendId}`, { method: 'DELETE' }),
  deleteFriendship: (petId, friendId) => request(`/friendships/${petId}/jauria/${friendId}`, { method: 'DELETE' }),
  reorderManada: (petId, ids) => request(`/friendships/${petId}/manada/reorder`, { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Companions
  getCompanions: (params = {}) => { const q = new URLSearchParams(params).toString(); return request(`/companions?${q}`); },
  getCompanion: (username) => request(`/companions/${username}`),
  getCompanionProfile: (username) => request(`/companions/${username}`),
  updateCompanionProfile: (companionId, data) =>
    request(`/companions/${companionId}`, { method: 'PUT', body: data }),

  // Companion Gallery
  uploadCompanionGalleryImage: (companionId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/companions/${companionId}/gallery`, { method: 'POST', body: formData });
  },
  getCompanionGallery: (companionId, limit = 10, offset = 0) =>
    request(`/companions/${companionId}/gallery?limit=${limit}&offset=${offset}`),
  deleteCompanionGalleryImage: (companionId, imageId) =>
    request(`/companions/${companionId}/gallery/${imageId}`, { method: 'DELETE' }),
  reorderCompanionGallery: (companionId, imageIds) =>
    request(`/companions/${companionId}/gallery/reorder`, { method: 'PUT', body: JSON.stringify({ imageIds }) }),

  // Chat
  getConversations: (petId) => request(petId ? `/chat/conversations?petId=${petId}` : '/chat/conversations'),
  startConversation: (pet_id) => request('/chat/conversations', { method: 'POST', body: JSON.stringify({ pet_id }) }),
  getMessages: (convId, since) => request(`/chat/conversations/${convId}/messages${since ? `?since=${encodeURIComponent(since)}` : ''}`),
  sendMessage: (convId, content, sent_as_owner = false) => request(`/chat/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify({ content, sent_as_owner }) }),
  deleteConversation: (convId) => request(`/chat/conversations/${convId}`, { method: 'DELETE' }),
  getChatUnread: () => request('/chat/unread'),

  // Contests
  getContests: () => request('/contests'),
  getActiveContests: () => request('/contests/active'),

  // Appointments (Citas/Paseos)
  getAppointments: (petId, status) => {
    const q = status ? `?status=${status}` : '';
    return request(`/appointments/${petId}${q}`);
  },
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, status) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request('/stats'),

  // Pet Tags
  addPetTag: (petId, tagName) => request(`/pets/${petId}/tags`, { method: 'POST', body: JSON.stringify({ tag_name: tagName }) }),
  removePetTag: (petId, tagName) => request(`/pets/${petId}/tags/${encodeURIComponent(tagName)}`, { method: 'DELETE' }),

  // Hydrant
  getHydrant: () => request('/hydrant'),
  toggleHydrant: (petId, enabled) => request(`/hydrant/${petId}/toggle`, { method: 'PUT', body: JSON.stringify({ enabled }) }),

  // Pet Posts
  getPetPosts: (petId, limit = 20, offset = 0) =>
    request(`/posts/pets/${petId}/posts?limit=${limit}&offset=${offset}`),
  createPetPost: (petId, content, sent_as_owner = false) =>
    request(`/posts/pets/${petId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deletePetPost: (petId, postId) =>
    request(`/posts/pets/${petId}/posts/${postId}`, { method: 'DELETE' }),

  // Pet Post Comments
  getPetPostComments: (petId, postId) =>
    request(`/posts/pets/${petId}/posts/${postId}/comments`),
  createPetPostComment: (petId, postId, content, sent_as_owner = false) =>
    request(`/posts/pets/${petId}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deletePetPostComment: (petId, postId, commentId) =>
    request(`/posts/pets/${petId}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Pet Gallery Comments
  getPetGalleryComments: (petId, imageId) =>
    request(`/posts/pets/${petId}/gallery/${imageId}/comments`),
  createPetGalleryComment: (petId, imageId, content, sent_as_owner = false) =>
    request(`/posts/pets/${petId}/gallery/${imageId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deletePetGalleryComment: (petId, imageId, commentId) =>
    request(`/posts/pets/${petId}/gallery/${imageId}/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Companion Posts
  getCompanionPosts: (companionId, limit = 20, offset = 0) =>
    request(`/posts/companions/${companionId}/posts?limit=${limit}&offset=${offset}`),
  createCompanionPost: (companionId, content, sent_as_owner = false) =>
    request(`/posts/companions/${companionId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteCompanionPost: (companionId, postId) =>
    request(`/posts/companions/${companionId}/posts/${postId}`, { method: 'DELETE' }),

  // Companion Post Comments
  getCompanionPostComments: (companionId, postId) =>
    request(`/posts/companions/${companionId}/posts/${postId}/comments`),
  createCompanionPostComment: (companionId, postId, content, sent_as_owner = false) =>
    request(`/posts/companions/${companionId}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteCompanionPostComment: (companionId, postId, commentId) =>
    request(`/posts/companions/${companionId}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Companion Gallery Comments
  getCompanionGalleryComments: (companionId, imageId) =>
    request(`/posts/companions/${companionId}/gallery/${imageId}/comments`),
  createCompanionGalleryComment: (companionId, imageId, content, sent_as_owner = false) =>
    request(`/posts/companions/${companionId}/gallery/${imageId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, sent_as_owner })
    }),
  deleteCompanionGalleryComment: (companionId, imageId, commentId) =>
    request(`/posts/companions/${companionId}/gallery/${imageId}/comments/${commentId}`, {
      method: 'DELETE'
    }),
};

export default api;
