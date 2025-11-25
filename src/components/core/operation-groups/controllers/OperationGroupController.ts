/**
 * Controlador para operation groups (grupos dentro de operaciones)
 * Expone los métodos de operation groups a los componentes
 */

import {
  getAllOperationGroupsUseCase,
  createOperationGroupUseCase,
  updateOperationGroupUseCase,
} from '../use-cases';
import {
  OperationGroupListResponseDto,
  OperationGroupResponseDto,
  OperationGroupCreateRequestDto,
  OperationGroupUpdateRequestDto,
} from '../dto';

export class OperationGroupController {
  /**
   * Obtiene todos los grupos de una operación
   */
  async getAllByOperation(operationId: string): Promise<OperationGroupListResponseDto | null> {
    try {
      return await getAllOperationGroupsUseCase.execute(operationId);
    } catch (error) {
      console.error('Error al obtener grupos de operación:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo grupo en una operación
   */
  async create(
    operationId: string,
    groupData: OperationGroupCreateRequestDto
  ): Promise<OperationGroupResponseDto | null> {
    try {
      return await createOperationGroupUseCase.execute(operationId, groupData);
    } catch (error) {
      console.error('Error al crear grupo de operación:', error);
      return null;
    }
  }

  /**
   * Actualiza un grupo existente
   */
  async update(
    groupId: string,
    groupData: OperationGroupUpdateRequestDto
  ): Promise<OperationGroupResponseDto | null> {
    try {
      return await updateOperationGroupUseCase.execute(groupId, groupData);
    } catch (error) {
      console.error('Error al actualizar grupo de operación:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const operationGroupController = new OperationGroupController();

