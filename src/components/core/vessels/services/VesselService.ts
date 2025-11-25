/**
 * Servicio para realizar operaciones de vessels (buques)
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  VesselListResponseDto,
  VesselCreateRequestDto,
  VesselUpdateRequestDto,
  VesselResponseDto,
} from '../dto';

export class VesselService {
  /**
   * Obtiene todos los buques
   * @param active Si se proporciona, filtra por estado activo
   * @returns Promise con la lista de buques
   */
  async getAll(active?: boolean): Promise<VesselListResponseDto> {
    try {
      let url = API_ENDPOINTS.VESSELS.BASE;
      if (active !== undefined) {
        url += `?active=${active}`;
      }
      const response = await httpService.get<VesselListResponseDto>(url);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener buques: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene un buque por ID
   * @param id ID del buque
   * @returns Promise con el buque
   */
  async getById(id: string): Promise<VesselResponseDto> {
    try {
      const response = await httpService.get<VesselResponseDto>(
        API_ENDPOINTS.VESSELS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener buque: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea un nuevo buque
   * @param vesselData Datos del buque a crear
   * @returns Promise con el buque creado
   */
  async create(vesselData: VesselCreateRequestDto): Promise<VesselResponseDto> {
    try {
      const response = await httpService.post<VesselResponseDto>(
        API_ENDPOINTS.VESSELS.BASE,
        vesselData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear buque: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza un buque existente
   * @param id ID del buque a actualizar
   * @param vesselData Datos actualizados del buque
   * @returns Promise con el buque actualizado
   */
  async update(
    id: string,
    vesselData: VesselUpdateRequestDto
  ): Promise<VesselResponseDto> {
    try {
      const response = await httpService.put<VesselResponseDto>(
        API_ENDPOINTS.VESSELS.BY_ID(id),
        vesselData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar buque: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const vesselService = new VesselService();

