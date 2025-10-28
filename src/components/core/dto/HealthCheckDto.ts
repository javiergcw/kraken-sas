/**
 * DTO para el health check del sistema
 */
export interface HealthCheckDto {
  environment: string;
  service: string;
  status: string;
  version: string;
}

