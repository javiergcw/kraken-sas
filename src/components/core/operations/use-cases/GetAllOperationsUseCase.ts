/**
 * Caso de uso para obtener todas las operaciones
 */

import { operationService } from '../services';
import { OperationListResponseDto } from '../dto';

export class GetAllOperationsUseCase {
  constructor(
    private readonly service = operationService
  ) {}

  async execute(date?: string): Promise<OperationListResponseDto> {
    try {
      const response = await this.service.getAll(date);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllOperationsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllOperationsUseCase = new GetAllOperationsUseCase();

