/**
 * Servicio para realizar operaciones relacionadas con el health check
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import { HealthCheckDto } from '../dto/HealthCheckDto';

export class HealthCheckService {
  /**
   * Obtiene el estado de salud del sistema
   * @returns Promise con la información del health check
   */
  async checkHealth(): Promise<HealthCheckDto> {
    try {
      const response = await httpService.get<HealthCheckDto>(API_ENDPOINTS.HEALTH);
      return response;
    } catch (error) {
      // Re-lanzar el error original con más contexto
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al verificar el estado del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const healthCheckService = new HealthCheckService();

