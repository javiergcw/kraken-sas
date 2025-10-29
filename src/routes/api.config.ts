/**
 * Configuración de rutas API
 * Centraliza todas las URLs y endpoints para facilitar cambios futuros
 */

// URL base del API externo
export const EXTERNAL_API_URL = 'https://api.oceanoscuba.com.co';

// Base URL para las API routes de Next.js (proxy local)
export const API_BASE_URL = '/api';

/**
 * Endpoints del API
 * NOTA: Estos son para las rutas LOCALES de Next.js (sin /v1)
 *       Las rutas externas usan EXTERNAL_ROUTES
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',  // Ruta local: /api/auth/login
    ME: '/auth/me',        // Ruta local: /api/auth/me
  },
  CATEGORIES: {
    BASE: '/v1/categories',
    BY_ID: (id: string) => `/v1/categories/${id}`,
  },
  SUBCATEGORIES: {
    BASE: '/v1/subcategories',
    BY_ID: (id: string) => `/v1/subcategories/${id}`,
  },
  PRODUCTS: {
    BASE: '/v1/products',
    BY_ID: (id: string) => `/v1/products/${id}`,
  },
  ZONES: {
    BASE: '/v1/zones',
  },
  BANNERS: {
    BASE: '/v1/banners',
    BY_ID: (id: string) => `/v1/banners/${id}`,
  },
} as const;

/**
 * Rutas externas (para las API routes de Next.js que hacen proxy)
 * NOTA: Estas rutas apuntan a la API EXTERNA (con /v1)
 */
export const EXTERNAL_ROUTES = {
  HEALTH: `${EXTERNAL_API_URL}${API_ENDPOINTS.HEALTH}`,
  AUTH: {
    LOGIN: `${EXTERNAL_API_URL}/api/v1/auth/login`,
    ME: `${EXTERNAL_API_URL}/api/v1/auth/me`,
  },
  CATEGORIES: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CATEGORIES.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CATEGORIES.BY_ID(id)}`,
  },
  SUBCATEGORIES: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.SUBCATEGORIES.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.SUBCATEGORIES.BY_ID(id)}`,
  },
  PRODUCTS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.PRODUCTS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`,
  },
  ZONES: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.ZONES.BASE}`,
  },
  BANNERS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.BANNERS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.BANNERS.BY_ID(id)}`,
  },
} as const;

