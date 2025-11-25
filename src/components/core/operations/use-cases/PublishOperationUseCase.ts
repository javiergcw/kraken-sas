/**
 * Caso de uso para publicar una operación
 */

import { operationService } from '../services';
import { OperationPublishRequestDto, OperationResponseDto } from '../dto';

export class PublishOperationUseCase {
  constructor(
    private readonly service = operationService
  ) {}

  async execute(id: string, publishData: OperationPublishRequestDto): Promise<OperationResponseDto> {
    try {
      const response = await this.service.publish(id, publishData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en PublishOperationUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const publishOperationUseCase = new PublishOperationUseCase();

