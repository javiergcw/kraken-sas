/**
 * Servicio para realizar operaciones de marinas
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  MarinaListResponseDto,
  MarinaCreateRequestDto,
  MarinaUpdateRequestDto,
  MarinaResponseDto,
} from '../dto';

export class MarinaService {
  /**
   * Obtiene todas las marinas
   * @param active Si se proporciona, filtra por estado activo
   * @returns Promise con la lista de marinas
   */
  async getAll(active?: boolean): Promise<MarinaListResponseDto> {
    try {
      let url = API_ENDPOINTS.MARINAS.BASE;
      if (active !== undefined) {
        url += `?active=${active}`;
      }
      const response = await httpService.get<MarinaListResponseDto>(url);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener marinas: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene una marina por ID
   * @param id ID de la marina
   * @returns Promise con la marina
   */
  async getById(id: string): Promise<MarinaResponseDto> {
    try {
      const response = await httpService.get<MarinaResponseDto>(
        API_ENDPOINTS.MARINAS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener marina: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva marina
   * @param marinaData Datos de la marina a crear
   * @returns Promise con la marina creada
   */
  async create(marinaData: MarinaCreateRequestDto): Promise<MarinaResponseDto> {
    try {
      const response = await httpService.post<MarinaResponseDto>(
        API_ENDPOINTS.MARINAS.BASE,
        marinaData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear marina: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una marina existente
   * @param id ID de la marina a actualizar
   * @param marinaData Datos actualizados de la marina
   * @returns Promise con la marina actualizada
   */
  async update(
    id: string,
    marinaData: MarinaUpdateRequestDto
  ): Promise<MarinaResponseDto> {
    try {
      const response = await httpService.put<MarinaResponseDto>(
        API_ENDPOINTS.MARINAS.BY_ID(id),
        marinaData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar marina: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const marinaService = new MarinaService();

