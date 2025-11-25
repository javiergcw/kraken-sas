/**
 * Caso de uso para actualizar una operación existente
 */

import { operationService } from '../services';
import { OperationUpdateRequestDto, OperationResponseDto } from '../dto';

export class UpdateOperationUseCase {
  constructor(
    private readonly service = operationService
  ) {}

  async execute(id: string, operationData: OperationUpdateRequestDto): Promise<OperationResponseDto> {
    try {
      const response = await this.service.update(id, operationData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateOperationUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateOperationUseCase = new UpdateOperationUseCase();

