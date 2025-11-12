/**
 * Servicio para realizar operaciones de zonas
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ZonesResponseDto,
  ZoneCreateRequestDto,
  ZoneResponseDto,
} from '../dto';

export class ZoneService {
  /**
   * Obtiene todas las zonas
   * @returns Promise con la lista de zonas
   */
  async getAll(): Promise<ZonesResponseDto> {
    try {
      const response = await httpService.get<ZonesResponseDto>(
        API_ENDPOINTS.ZONES.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener zonas: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva zona
   * @param zoneData Datos de la zona a crear
   * @returns Promise con la zona creada
   */
  async create(zoneData: ZoneCreateRequestDto): Promise<ZoneResponseDto> {
    try {
      const response = await httpService.post<ZoneResponseDto>(
        API_ENDPOINTS.ZONES.BASE,
        zoneData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear zona: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const zoneService = new ZoneService();

