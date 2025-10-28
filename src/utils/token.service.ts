/**
 * Servicio para manejar el token de autenticación
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface UserData {
  id: string;
  email: string;
  role: string;
  company_id: string | null;
}

class TokenService {
  /**
   * Guarda el token en localStorage
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  /**
   * Guarda los datos del usuario en localStorage
   */
  setUser(user: UserData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Obtiene los datos del usuario del localStorage
   */
  getUser(): UserData | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData) as UserData;
        } catch (error) {
          console.error('Error al parsear datos del usuario:', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Verifica si hay un token guardado
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Verifica si el usuario tiene una compañía asignada
   */
  hasCompany(): boolean {
    const user = this.getUser();
    return user?.company_id !== null && user?.company_id !== undefined;
  }

  /**
   * Elimina el token y los datos del usuario (logout)
   */
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}

// Exportar una instancia singleton
export const tokenService = new TokenService();

