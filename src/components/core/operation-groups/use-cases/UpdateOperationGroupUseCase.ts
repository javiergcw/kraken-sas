/**
 * Caso de uso para actualizar un grupo de operación
 */

import { operationGroupService } from '../services';
import { OperationGroupUpdateRequestDto, OperationGroupResponseDto } from '../dto';

export class UpdateOperationGroupUseCase {
  constructor(
    private readonly service = operationGroupService
  ) {}

  async execute(
    groupId: string,
    groupData: OperationGroupUpdateRequestDto
  ): Promise<OperationGroupResponseDto> {
    try {
      const response = await this.service.update(groupId, groupData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateOperationGroupUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateOperationGroupUseCase = new UpdateOperationGroupUseCase();

