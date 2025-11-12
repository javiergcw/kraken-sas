/**
 * Controlador para zonas
 */

import { getAllZonesUseCase } from '../use-cases/GetAllZonesUseCase';
import { createZoneUseCase } from '../use-cases/CreateZoneUseCase';
import {
  ZonesResponseDto,
  ZoneCreateRequestDto,
  ZoneResponseDto,
} from '../dto';

export class ZoneController {
  /**
   * Obtiene todas las zonas
   * @returns Promise con la lista de zonas o null en caso de error
   */
  async getAll(): Promise<ZonesResponseDto | null> {
    try {
      return await getAllZonesUseCase.execute();
    } catch (error) {
      console.error('Error al obtener zonas:', error);
      return null;
    }
  }

  /**
   * Crea una nueva zona
   * @param zoneData Datos de la zona a crear
   * @returns Promise con la zona creada o null en caso de error
   */
  async create(zoneData: ZoneCreateRequestDto): Promise<ZoneResponseDto | null> {
    try {
      return await createZoneUseCase.execute(zoneData);
    } catch (error) {
      console.error('Error al crear zona:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const zoneController = new ZoneController();

