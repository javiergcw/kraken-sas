/**
 * Caso de uso para crear una nueva actividad
 */

import { activityService } from '../services';
import { ActivityCreateRequestDto, ActivityResponseDto } from '../dto';

export class CreateActivityUseCase {
  constructor(
    private readonly service = activityService
  ) {}

  async execute(activityData: ActivityCreateRequestDto): Promise<ActivityResponseDto> {
    try {
      const response = await this.service.create(activityData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateActivityUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createActivityUseCase = new CreateActivityUseCase();

