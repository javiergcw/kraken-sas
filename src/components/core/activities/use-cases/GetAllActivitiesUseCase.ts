/**
 * Caso de uso para obtener todas las actividades
 */

import { activityService } from '../services';
import { ActivityListResponseDto } from '../dto';

export class GetAllActivitiesUseCase {
  constructor(
    private readonly service = activityService
  ) {}

  async execute(active?: boolean): Promise<ActivityListResponseDto> {
    try {
      const response = await this.service.getAll(active);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllActivitiesUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllActivitiesUseCase = new GetAllActivitiesUseCase();

