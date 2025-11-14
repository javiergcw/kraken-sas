/**
 * Caso de uso para obtener los datos del usuario autenticado
 */

import { UserService, userService } from '../services/UserService';
import { GetMeResponseDto } from '../dto';

export class GetMeUseCase {
  private userService: UserService;

  constructor(service: UserService = userService) {
    this.userService = service;
  }

  /**
   * Ejecuta la obtención de los datos del usuario autenticado
   * @returns Promise con los datos del usuario
   */
  async execute(): Promise<GetMeResponseDto> {
    try {
      const response = await this.userService.getMe();
      return response;
    } catch (error) {
      // Log detallado del error
      console.error('[GetMeUseCase] Error al obtener usuario:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      throw new Error(
        `Error en GetMeUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del caso de uso
export const getMeUseCase = new GetMeUseCase();

