/**
 * Servicio HTTP general para realizar peticiones a la API
 */

import { API_BASE_URL } from './constants';
import { tokenService } from './token.service';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = 'HttpError';
  }
}

class HttpService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Construye la URL completa con query params
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Asegurar que el endpoint empiece con /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Construir la URL base
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    
    // Si la baseURL es relativa, construir directamente la ruta
    let urlString: string;
    if (baseUrl.startsWith('/')) {
      // URL relativa
      urlString = `${baseUrl}${cleanEndpoint}`;
    } else {
      // URL absoluta
      const url = new URL(cleanEndpoint, baseUrl);
      urlString = url.toString();
    }
    
    // Agregar query params si existen
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      urlString += `?${searchParams.toString()}`;
    }

    return urlString;
  }

  /**
   * Realiza una petición HTTP
   */
  private async request<T>(
    endpoint: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
    } = options;

    const url = this.buildURL(endpoint, params);
    
    // Log para debugging (remover en producción)
    console.log('🔗 Request URL:', url);
    console.log('📤 Method:', method);

    // Solo agregar Content-Type para métodos que tienen body
    const methodsWithBody: Array<'POST' | 'PUT' | 'PATCH' | 'DELETE'> = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const hasBody = body && methodsWithBody.includes(method as any);

    const defaultHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };

    // Agregar token de autenticación si está disponible
    const token = tokenService.getToken();
    if (token && !defaultHeaders['Authorization']) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Solo mantener Content-Type si hay body, de lo contrario eliminarlo
    if (!hasBody && defaultHeaders['Content-Type']) {
      delete defaultHeaders['Content-Type'];
    }

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
      mode: 'cors',
      cache: 'no-cache',
    };

    // Solo agregar body para métodos que lo soportan
    if (hasBody) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      let data: T;
      const contentType = response.headers.get('content-type');
      
      // Leer el texto de la respuesta
      const responseText = await response.text();
      
      // Intentar parsear como JSON
      if (contentType?.includes('application/json') || responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
        try {
          data = JSON.parse(responseText) as T;
        } catch {
          // Si falla el parseo JSON, usar como texto
          data = responseText as any;
        }
      } else {
        data = responseText as any;
      }

      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status, response.statusText);
        console.error('📥 Response data:', data);
        throw new HttpError(response.status, response.statusText, data);
      }

      console.log('✅ Success:', response.status, response.statusText);
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      
      // Error de red o desconocido
      console.error('🚨 Network error:', error);
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'GET', params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'POST', body, headers });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'PUT', body, headers });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'PATCH', body, headers });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'DELETE', headers });
    return response.data;
  }
}

// Exportar una instancia singleton del servicio HTTP
export const httpService = new HttpService();

// También exportar la clase para crear instancias personalizadas si es necesario
export default HttpService;

