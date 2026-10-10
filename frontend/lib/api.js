export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'cees_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Core request helper returning the full JSON envelope. Throws an error tagged
 * with a `code` so callers can branch on the failure:
 *  - NOT_FOUND : the resource genuinely does not exist (HTTP 404)
 *  - NETWORK   : the request could not reach the server at all
 *  - SERVER    : the server responded with an unexpected status (includes 422)
 * Server validation errors are attached as `err.errors` ({ field: message }).
 */
export async function apiRequestRaw(path, options = {}) {
  const token = getToken();
  const headers = { Accept: 'application/json', ...(options.headers || {}) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    const err = new Error('Unable to reach the Cee\u2019s API. Is the server running?');
    err.code = 'NETWORK';
    throw err;
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(json?.message || 'Request failed');
    err.status = res.status;
    err.code = res.status === 404 ? 'NOT_FOUND' : 'SERVER';
    err.errors = json?.errors || null;
    throw err;
  }

  return json;
}

/** Returns only the `data` payload of a successful response. */
export async function apiRequest(path, options = {}) {
  const json = await apiRequestRaw(path, options);
  return json?.data;
}

/** Returns { data, meta, message } — used for paginated list endpoints. */
export async function apiList(path, options = {}) {
  const json = await apiRequestRaw(path, options);
  return { data: json?.data ?? [], meta: json?.meta || null, message: json?.message };
}

export function trackDelivery(trackingCode) {
  return apiRequest(`/deliveries/track/${encodeURIComponent(trackingCode)}`);
}

/* Auth */
export function loginRequest(payload) {
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function registerRequest(payload) {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function fetchMe() {
  return apiRequest('/auth/me');
}

export function updateProfile(payload) {
  return apiRequest('/auth/me', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function changePassword(payload) {
  return apiRequest('/auth/me/password', { method: 'PATCH', body: JSON.stringify(payload) });
}

/* Deliveries */
export function listDeliveries({ status, search, page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (search) query.set('search', search);
  query.set('page', page);
  query.set('limit', limit);
  return apiList(`/deliveries?${query.toString()}`);
}

export function getDelivery(id) {
  return apiRequest(`/deliveries/${id}`);
}

export function cancelDelivery(id, reason) {
  return apiRequest(`/deliveries/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function updateDeliveryStatus(id, status, note) {
  return apiRequest(`/deliveries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

/* Rider */
export function getRiderProfile() {
  return apiRequest('/rider/profile');
}

export function updateRiderAvailability(availability) {
  return apiRequest('/rider/availability', {
    method: 'PATCH',
    body: JSON.stringify({ availability }),
  });
}

export function listRiderJobs({ page = 1, limit = 10 } = {}) {
  return apiList(`/rider/jobs?page=${page}&limit=${limit}`);
}

export function acceptRiderJob(id) {
  return apiRequest(`/rider/jobs/${id}/accept`, { method: 'POST' });
}

export function listRiderDeliveries({ status, page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  query.set('page', page);
  query.set('limit', limit);
  return apiList(`/rider/deliveries?${query.toString()}`);
}

export function listRiderHistory({ page = 1, limit = 10 } = {}) {
  return apiList(`/rider/deliveries/history?page=${page}&limit=${limit}`);
}

export function riderUpdateStatus(id, status, note) {
  return apiRequest(`/rider/deliveries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

/* Admin */
export function getAdminDashboard() {
  return apiRequest('/admin/dashboard');
}

export function listAdminDeliveries({ status, search, page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (search) query.set('search', search);
  query.set('page', page);
  query.set('limit', limit);
  return apiList(`/admin/deliveries?${query.toString()}`);
}

export function assignDeliveryRider(id, riderId, note) {
  return apiRequest(`/admin/deliveries/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ riderId: Number(riderId), note }),
  });
}

export function listAdminRiders({ page = 1, limit = 10, isVerified, availability, status, search } = {}) {
  const query = new URLSearchParams();
  if (isVerified !== undefined) query.set('isVerified', isVerified);
  if (availability) query.set('availability', availability);
  if (status) query.set('status', status);
  if (search) query.set('search', search);
  query.set('page', page);
  query.set('limit', limit);
  return apiList(`/admin/riders?${query.toString()}`);
}

export function verifyRider(id, isVerified) {
  return apiRequest(`/admin/riders/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ isVerified }),
  });
}

export function listAdminUsers({ role, status, search, page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams();
  if (role) query.set('role', role);
  if (status) query.set('status', status);
  if (search) query.set('search', search);
  query.set('page', page);
  query.set('limit', limit);
  return apiList(`/admin/users?${query.toString()}`);
}

export function updateUserStatus(id, status) {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
