/**
 * Caso de uso para actualizar una actividad existente
 */

import { activityService } from '../services';
import { ActivityUpdateRequestDto, ActivityResponseDto } from '../dto';

export class UpdateActivityUseCase {
  constructor(
    private readonly service = activityService
  ) {}

  async execute(id: string, activityData: ActivityUpdateRequestDto): Promise<ActivityResponseDto> {
    try {
      const response = await this.service.update(id, activityData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateActivityUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateActivityUseCase = new UpdateActivityUseCase();

