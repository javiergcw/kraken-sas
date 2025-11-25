/**
 * Caso de uso para crear una nueva operación
 */

import { operationService } from '../services';
import { OperationCreateRequestDto, OperationResponseDto } from '../dto';

export class CreateOperationUseCase {
  constructor(
    private readonly service = operationService
  ) {}

  async execute(operationData: OperationCreateRequestDto): Promise<OperationResponseDto> {
    try {
      const response = await this.service.create(operationData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateOperationUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createOperationUseCase = new CreateOperationUseCase();

