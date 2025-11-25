/**
 * Caso de uso para obtener una operación por ID
 */

import { operationService } from '../services';
import { OperationResponseDto } from '../dto';

export class GetOperationByIdUseCase {
  constructor(
    private readonly service = operationService
  ) {}

  async execute(id: string): Promise<OperationResponseDto> {
    try {
      const response = await this.service.getById(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetOperationByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getOperationByIdUseCase = new GetOperationByIdUseCase();

