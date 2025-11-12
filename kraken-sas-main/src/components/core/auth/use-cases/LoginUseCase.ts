/**
 * Caso de uso para el proceso de login
 */

import { AuthService, authService } from '../services/AuthService';
import { tokenService } from '@/utils/token.service';
import { LoginRequestDto, LoginResponseDto } from '../dto';

export class LoginUseCase {
  private authService: AuthService;

  constructor(service: AuthService = authService) {
    this.authService = service;
  }

  /**
   * Ejecuta el proceso de login completo
   * @param credentials Credenciales de login
   * @returns Promise con la respuesta del login
   * @throws Error si el login falla
   */
  async execute(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      // Realizar el login
      const response = await this.authService.login(credentials);

      // Si el login es exitoso, guardar el token y los datos del usuario
      if (response.success && response.data.token) {
        tokenService.setToken(response.data.token);
        tokenService.setUser(response.data.User);
      }

      return response;
    } catch (error) {
      throw new Error(
        `Error en el caso de uso Login: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del caso de uso
export const loginUseCase = new LoginUseCase();

