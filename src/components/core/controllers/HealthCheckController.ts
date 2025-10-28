/**
 * Controlador para el health check
 */

import { checkHealthUseCase } from '../use-cases/CheckHealthUseCase';
import { HealthCheckDto } from '../dto/HealthCheckDto';

export class HealthCheckController {
  /**
   * Obtiene el estado de salud del sistema
   * @returns Promise con la información del health check o null en caso de error
   */
  async getHealthStatus(): Promise<HealthCheckDto | null> {
    try {
      const healthStatus = await checkHealthUseCase.execute();
      return healthStatus;
    } catch (error) {
      console.error('Error al obtener el estado del sistema:', error);
      return null;
    }
  }

  /**
   * Obtiene la versión del sistema
   * @returns Promise con la versión del sistema o null si hay error
   */
  async getVersion(): Promise<string | null> {
    try {
      const healthStatus = await this.getHealthStatus();
      return healthStatus?.version || null;
    } catch (error) {
      console.error('Error al obtener la versión:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const healthCheckController = new HealthCheckController();

