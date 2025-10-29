/**
 * Servicio para realizar operaciones de autenticación
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import { LoginRequestDto, LoginResponseDto } from '../dto/LoginDto';
import { GetMeResponseDto } from '../dto/UserDto';

export class AuthService {
  /**
   * Realiza el login del usuario
   * @param credentials Credenciales de login (email y password)
   * @returns Promise con la respuesta del login
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      const response = await httpService.post<LoginResponseDto>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response;
    } catch (error) {
      // Re-lanzar el error original
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al realizar login: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene la información del usuario autenticado
   * @returns Promise con la información del usuario
   */
  async getMe(): Promise<GetMeResponseDto> {
    try {
      const response = await httpService.get<GetMeResponseDto>(
        API_ENDPOINTS.AUTH.ME
      );
      return response;
    } catch (error) {
      // Re-lanzar el error original
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener información del usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const authService = new AuthService();

