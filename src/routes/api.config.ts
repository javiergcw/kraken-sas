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
  STORAGE: {
    UPLOAD_FILE: '/v1/storage/files',
    GET_FOLDERS: '/v1/storage/folders',
  },
  CONTRACTS: {
    BASE: '/v1/contracts',
    BY_ID: (id: string) => `/v1/contracts/${id}`,
    SIGN: (id: string) => `/v1/contracts/${id}/sign`,
    INVALIDATE: (id: string) => `/v1/contracts/${id}/invalidate`,
    PDF: (id: string) => `/v1/contracts/${id}/pdf`,
    TEMPLATES: {
      BASE: '/v1/contracts/templates',
      BY_ID: (id: string) => `/v1/contracts/templates/${id}`,
      VARIABLES: (templateId: string) => `/v1/contracts/templates/${templateId}/variables`,
    },
    VARIABLES: {
      BY_ID: (id: string) => `/v1/contracts/variables/${id}`,
    },
    PUBLIC: {
      BY_TOKEN: (token: string) => `/v1/public/contracts/${token}`,
      SIGN: (token: string) => `/v1/public/contracts/${token}/sign`,
      STATUS: (token: string) => `/v1/public/contracts/${token}/status`,
    },
  },
  COMPANY_SETTINGS: {
    BASE: '/v1/company-settings',
  },
  PEOPLE: {
    BASE: '/v1/people',
    BY_ID: (id: string) => `/v1/people/${id}`,
  },
  ACTIVITIES: {
    BASE: '/v1/activities',
    BY_ID: (id: string) => `/v1/activities/${id}`,
  },
  MARINAS: {
    BASE: '/v1/marinas',
    BY_ID: (id: string) => `/v1/marinas/${id}`,
  },
  VESSELS: {
    BASE: '/v1/vessels',
    BY_ID: (id: string) => `/v1/vessels/${id}`,
  },
  OPERATIONS: {
    BASE: '/v1/operations',
    BY_ID: (id: string) => `/v1/operations/${id}`,
    PUBLISH: (id: string) => `/v1/operations/${id}/publish`,
  },
  OPERATION_GROUPS: {
    BY_OPERATION: (operationId: string) => `/v1/operations/${operationId}/groups`,
    BY_ID: (groupId: string) => `/v1/operation-groups/${groupId}`,
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
  STORAGE: {
    UPLOAD_FILE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.STORAGE.UPLOAD_FILE}`,
    GET_FOLDERS: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.STORAGE.GET_FOLDERS}`,
  },
  CONTRACTS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.BY_ID(id)}`,
    SIGN: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.SIGN(id)}`,
    INVALIDATE: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.INVALIDATE(id)}`,
    PDF: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.PDF(id)}`,
    TEMPLATES: {
      BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.TEMPLATES.BASE}`,
      BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.TEMPLATES.BY_ID(id)}`,
      VARIABLES: (templateId: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.TEMPLATES.VARIABLES(templateId)}`,
    },
    VARIABLES: {
      BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.VARIABLES.BY_ID(id)}`,
    },
    PUBLIC: {
      BY_TOKEN: (token: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.PUBLIC.BY_TOKEN(token)}`,
      SIGN: (token: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.PUBLIC.SIGN(token)}`,
      STATUS: (token: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.CONTRACTS.PUBLIC.STATUS(token)}`,
    },
  },
  COMPANY_SETTINGS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.COMPANY_SETTINGS.BASE}`,
  },
  PEOPLE: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.PEOPLE.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.PEOPLE.BY_ID(id)}`,
  },
  ACTIVITIES: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.ACTIVITIES.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.ACTIVITIES.BY_ID(id)}`,
  },
  MARINAS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.MARINAS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.MARINAS.BY_ID(id)}`,
  },
  VESSELS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.VESSELS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.VESSELS.BY_ID(id)}`,
  },
  OPERATIONS: {
    BASE: `${EXTERNAL_API_URL}/api${API_ENDPOINTS.OPERATIONS.BASE}`,
    BY_ID: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.OPERATIONS.BY_ID(id)}`,
    PUBLISH: (id: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.OPERATIONS.PUBLISH(id)}`,
  },
  OPERATION_GROUPS: {
    BY_OPERATION: (operationId: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.OPERATION_GROUPS.BY_OPERATION(operationId)}`,
    BY_ID: (groupId: string) => `${EXTERNAL_API_URL}/api${API_ENDPOINTS.OPERATION_GROUPS.BY_ID(groupId)}`,
  },
} as const;

