/**
 * DTOs para responses de health check
 */

export interface HealthCheckDto {
  environment: string;
  service: string;
  status: string;
  version: string;
}

