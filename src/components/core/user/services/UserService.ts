/**
 * Servicio para realizar operaciones de usuario
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import { GetMeResponseDto } from '../dto';

export class UserService {
  /**
   * Obtiene los datos del usuario autenticado
   * @returns Promise con los datos del usuario
   */
  async getMe(): Promise<GetMeResponseDto> {
    try {
      const response = await httpService.get<GetMeResponseDto>(API_ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener datos del usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const userService = new UserService();

