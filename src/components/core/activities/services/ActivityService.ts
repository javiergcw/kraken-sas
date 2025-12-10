/**
 * Servicio para realizar operaciones de activities
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ActivityListResponseDto,
  ActivityCreateRequestDto,
  ActivityUpdateRequestDto,
  ActivityResponseDto,
} from '../dto';

export class ActivityService {
  /**
   * Obtiene todas las actividades
   * @param active Si se proporciona, filtra por estado activo
   * @returns Promise con la lista de actividades
   */
  async getAll(active?: boolean, token?: string): Promise<ActivityListResponseDto> {
    try {
      let url = API_ENDPOINTS.ACTIVITIES.BASE;
      if (active !== undefined) {
        url += `?active=${active}`;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await httpService.get<ActivityListResponseDto>(url, { headers });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener actividades: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene una actividad por ID
   * @param id ID de la actividad
   * @returns Promise con la actividad
   */
  async getById(id: string): Promise<ActivityResponseDto> {
    try {
      const response = await httpService.get<ActivityResponseDto>(
        API_ENDPOINTS.ACTIVITIES.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener actividad: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva actividad
   * @param activityData Datos de la actividad a crear
   * @returns Promise con la actividad creada
   */
  async create(activityData: ActivityCreateRequestDto): Promise<ActivityResponseDto> {
    try {
      const response = await httpService.post<ActivityResponseDto>(
        API_ENDPOINTS.ACTIVITIES.BASE,
        activityData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear actividad: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una actividad existente
   * @param id ID de la actividad a actualizar
   * @param activityData Datos actualizados de la actividad
   * @returns Promise con la actividad actualizada
   */
  async update(
    id: string,
    activityData: ActivityUpdateRequestDto
  ): Promise<ActivityResponseDto> {
    try {
      const response = await httpService.put<ActivityResponseDto>(
        API_ENDPOINTS.ACTIVITIES.BY_ID(id),
        activityData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar actividad: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const activityService = new ActivityService();

