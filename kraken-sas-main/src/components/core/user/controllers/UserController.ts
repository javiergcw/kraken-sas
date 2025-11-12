/**
 * Controlador para usuario
 */

import { getMeUseCase } from '../use-cases';
import { GetMeResponseDto } from '../dto';

export class UserController {
  /**
   * Obtiene los datos del usuario autenticado
   * @returns Promise con los datos del usuario o null en caso de error
   */
  async getMe(): Promise<GetMeResponseDto | null> {
    try {
      return await getMeUseCase.execute();
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const userController = new UserController();

