/**
 * Caso de uso para obtener todos los grupos de una operación
 */

import { operationGroupService } from '../services';
import { OperationGroupListResponseDto } from '../dto';

export class GetAllOperationGroupsUseCase {
  constructor(
    private readonly service = operationGroupService
  ) {}

  async execute(operationId: string): Promise<OperationGroupListResponseDto> {
    try {
      const response = await this.service.getAllByOperation(operationId);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllOperationGroupsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllOperationGroupsUseCase = new GetAllOperationGroupsUseCase();

