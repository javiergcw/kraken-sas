/**
 * Caso de uso: Obtener información del usuario autenticado
 */

import { authService } from '../services/AuthService';
import { GetMeResponseDto } from '../dto/UserDto';

export class GetMeUseCase {
  /**
   * Ejecuta el caso de uso
   * @returns Promise con la información del usuario
   */
  async execute(): Promise<GetMeResponseDto> {
    try {
      return await authService.getMe();
    } catch (error) {
      console.error('Error en GetMeUseCase:', error);
      throw error;
    }
  }
}

// Exportar una instancia singleton del caso de uso
export const getMeUseCase = new GetMeUseCase();

