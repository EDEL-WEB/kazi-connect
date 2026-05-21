import api from './client';

export const authAPI = {
  register: (d) => api.post('/api/auth/register', d),
  login: (d) => api.post('/api/auth/login', d),
  verifyOtp: (d) => api.post('/api/auth/verify-otp', d),
  verifyLoginOtp: (d) => api.post('/api/auth/verify-login-otp', d),
};

export const usersAPI = {
  me: () => api.get('/api/users/me'),
};

export const workersAPI = {
  create: (d) => api.post('/api/workers', d),
  me: () => api.get('/api/workers/me'),
  categories: () => api.get('/api/workers/categories').then(r => ({ ...r, data: Array.isArray(r.data) ? r.data : (r.data?.categories || []) })),
  updateSkills: (d) => api.put('/api/workers/skills', d),
  updateLocation: (d) => api.put('/api/workers/location', d),
  updateAvailability: (d) => api.put('/api/workers/availability', d),
  search: (p) => api.get('/api/workers/search', { params: p }),
  getProfile: (id) => api.get(`/api/workers/${id}`),
};

export const jobsAPI = {
  create: (d) => api.post('/api/jobs', d),
  get: (id) => api.get(`/api/jobs/${id}`),
  myJobs: () => api.get('/api/jobs/my-jobs'),
  availableJobs: () => api.get('/api/jobs/available'),
  accept: (id, d) => api.post(`/api/jobs/${id}/accept`, d),
  approveRate: (id, d) => api.post(`/api/jobs/${id}/approve-rate`, d),
  updateStatus: (id, d) => api.patch(`/api/jobs/${id}/status`, d),
  flaggedWorkers: () => api.get('/api/jobs/flagged-workers'),
};

export const escrowAPI = {
  createJob: (d) => api.post('/api/escrow/jobs/create', d),
  accept: (id, d) => api.post(`/api/escrow/jobs/${id}/accept`, d),
  complete: (id) => api.post(`/api/escrow/jobs/${id}/complete`),
  approve: (id) => api.post(`/api/escrow/jobs/${id}/approve`),
  cancel: (id) => api.post(`/api/escrow/jobs/${id}/cancel`),
  dispute: (id) => api.post(`/api/escrow/jobs/${id}/dispute`),
  resolveDispute: (id, d) => api.post(`/api/escrow/admin/disputes/${id}/resolve`, d),
  status: (id) => api.get(`/api/escrow/jobs/${id}/status`),
};

export const paymentsAPI = {
  release: (id) => api.post(`/api/payments/release/${id}`),
  refund: (id) => api.post(`/api/payments/refund/${id}`),
  wallet: () => api.get('/api/payments/wallet'),
  transactions: () => api.get('/api/payments/transactions'),
};

export const jobUpdatesAPI = {
  updateProgress: (id, d) => api.patch(`/api/job-updates/${id}/progress`, d),
  addNote: (id, d) => api.post(`/api/job-updates/${id}/notes`, d),
  uploadPhotos: (id, d) => api.post(`/api/job-updates/${id}/photos`, d),
  getUpdates: (id) => api.get(`/api/job-updates/${id}/updates`),
  getTimeline: (id) => api.get(`/api/job-updates/${id}/timeline`),
};

export const trackingAPI = {
  update: (id, d) => api.post(`/api/tracking/${id}/update`, d),
  getLocation: (id) => api.get(`/api/tracking/${id}/location`),
  getHistory: (id) => api.get(`/api/tracking/${id}/history`),
};

export const reviewsAPI = {
  create: (d) => api.post('/api/reviews', d),
  getWorkerReviews: (id) => api.get(`/api/reviews/worker/${id}`),
};

export const categoriesAPI = {
  list: () => api.get('/api/categories').then(r => ({ ...r, data: Array.isArray(r.data) ? r.data : (r.data?.categories || []) })),
  create: (d) => api.post('/api/categories', d),
};

export const notificationsAPI = {
  heartbeat: () => api.post('/api/notifications/heartbeat'),
  offline: () => api.post('/api/notifications/offline'),
  pending: () => api.get('/api/notifications/pending').then(r => ({ ...r, data: Array.isArray(r.data) ? r.data : (r.data?.notifications || []) })),
  markRead: (id) => api.post(`/api/notifications/${id}/mark-read`),
  userStatus: (id) => api.get(`/api/notifications/status/${id}`),
};

export const verificationAPI = {
  initiate: () => api.post('/api/verification/initiate'),
  uploadId: (d) => api.post('/api/verification/upload-id', d),
  verifyPhone: (d) => api.post('/api/verification/verify-phone', d),
  uploadSelfie: (d) => api.post('/api/verification/upload-selfie', d),
  uploadSkills: (d) => api.post('/api/verification/upload-skills', d),
  status: () => api.get('/api/verification/status'),
  adminPending: () => api.get('/api/verification/admin/pending'),
  adminReview: (id, d) => api.post(`/api/verification/admin/review/${id}`, d),
};

export const adminAPI = {
  atBalance: () => api.get('/api/at/balance'),
  sendSms: (d) => api.post('/api/sms/send', d),
  stats: () => api.get('/api/admin/stats'),
  allUsers: (p) => api.get('/api/admin/users', { params: p }),
  allJobs: (p) => api.get('/api/admin/jobs', { params: p }),
  recentTransactions: () => api.get('/api/admin/transactions/recent'),
  commissionSummary: () => api.get('/api/admin/commission/summary'),
};
