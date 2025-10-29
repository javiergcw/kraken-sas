/**
 * Constantes de la aplicación
 */

// URL base para las API routes de Next.js (proxy local)
export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
} as const;

