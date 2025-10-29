/**
 * Controlador para la autenticación
 */

import { loginUseCase } from '../use-cases/LoginUseCase';
import { getMeUseCase } from '../use-cases/GetMeUseCase';
import { tokenService } from '@/utils/token.service';
import { LoginRequestDto, LoginResponseDto } from '../dto/LoginDto';
import { GetMeResponseDto } from '../dto/UserDto';

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
   * Obtiene los datos del usuario actual desde el token
   */
  getCurrentUser() {
    return tokenService.getUser();
  }

  /**
   * Obtiene la información del usuario autenticado desde la API
   * @returns Promise con la información del usuario o null en caso de error
   */
  async getMe(): Promise<GetMeResponseDto | null> {
    try {
      const response = await getMeUseCase.execute();
      return response;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      return null;
    }
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

