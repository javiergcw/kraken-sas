/**
 * Caso de uso para crear un grupo en una operación
 */

import { operationGroupService } from '../services';
import { OperationGroupCreateRequestDto, OperationGroupResponseDto } from '../dto';

export class CreateOperationGroupUseCase {
  constructor(
    private readonly service = operationGroupService
  ) {}

  async execute(
    operationId: string,
    groupData: OperationGroupCreateRequestDto
  ): Promise<OperationGroupResponseDto> {
    try {
      const response = await this.service.create(operationId, groupData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateOperationGroupUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createOperationGroupUseCase = new CreateOperationGroupUseCase();

