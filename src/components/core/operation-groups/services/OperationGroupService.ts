/**
 * Servicio para realizar operaciones de operation groups (grupos dentro de operaciones)
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  OperationGroupListResponseDto,
  OperationGroupCreateRequestDto,
  OperationGroupUpdateRequestDto,
  OperationGroupResponseDto,
} from '../dto';

export class OperationGroupService {
  /**
   * Obtiene todos los grupos de una operación
   * @param operationId ID de la operación
   * @returns Promise con la lista de grupos
   */
  async getAllByOperation(operationId: string): Promise<OperationGroupListResponseDto> {
    try {
      const response = await httpService.get<OperationGroupListResponseDto>(
        API_ENDPOINTS.OPERATION_GROUPS.BY_OPERATION(operationId)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener grupos de operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea un nuevo grupo en una operación
   * @param operationId ID de la operación
   * @param groupData Datos del grupo a crear
   * @returns Promise con el grupo creado
   */
  async create(
    operationId: string,
    groupData: OperationGroupCreateRequestDto
  ): Promise<OperationGroupResponseDto> {
    try {
      const response = await httpService.post<OperationGroupResponseDto>(
        API_ENDPOINTS.OPERATION_GROUPS.BY_OPERATION(operationId),
        groupData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear grupo de operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza un grupo existente
   * @param groupId ID del grupo a actualizar
   * @param groupData Datos actualizados del grupo
   * @returns Promise con el grupo actualizado
   */
  async update(
    groupId: string,
    groupData: OperationGroupUpdateRequestDto
  ): Promise<OperationGroupResponseDto> {
    try {
      const response = await httpService.put<OperationGroupResponseDto>(
        API_ENDPOINTS.OPERATION_GROUPS.BY_ID(groupId),
        groupData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar grupo de operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const operationGroupService = new OperationGroupService();

