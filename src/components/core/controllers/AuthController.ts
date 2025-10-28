/**
 * Controlador para la autenticación
 */

import { loginUseCase } from '../use-cases/LoginUseCase';
import { tokenService } from '@/utils/token.service';
import { LoginRequestDto, LoginResponseDto } from '../dto/LoginDto';

export class AuthController {
  /**
   * Realiza el login del usuario
   * @param credentials Credenciales de login
   * @returns Promise con la respuesta del login o null en caso de error
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto | null> {
    try {
      const response = await loginUseCase.execute(credentials);
      return response;
    } catch (error) {
      console.error('Error al realizar login:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return tokenService.hasToken();
  }

  /**
   * Verifica si el usuario tiene una compañía asignada
   */
  hasCompany(): boolean {
    return tokenService.hasCompany();
  }

  /**
   * Obtiene los datos del usuario actual
   */
  getCurrentUser() {
    return tokenService.getUser();
  }

  /**
   * Realiza el logout del usuario
   */
  logout(): void {
    tokenService.clearToken();
  }
}

// Exportar una instancia singleton del controlador
export const authController = new AuthController();

