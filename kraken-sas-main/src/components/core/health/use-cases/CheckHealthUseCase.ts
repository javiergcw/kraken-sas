/**
 * Caso de uso para verificar el estado de salud del sistema
 */

import { HealthCheckService, healthCheckService } from '../services/HealthCheckService';
import { HealthCheckDto } from '../dto';

export class CheckHealthUseCase {
  private healthCheckService: HealthCheckService;

  constructor(service: HealthCheckService = healthCheckService) {
    this.healthCheckService = service;
  }

  /**
   * Ejecuta la verificación del estado de salud del sistema
   * @returns Promise con la información del health check
   * @throws Error si no se puede obtener el estado
   */
  async execute(): Promise<HealthCheckDto> {
    try {
      const healthStatus = await this.healthCheckService.checkHealth();
      return healthStatus;
    } catch (error) {
      throw new Error(
        `Error en el caso de uso CheckHealth: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del caso de uso
export const checkHealthUseCase = new CheckHealthUseCase();

