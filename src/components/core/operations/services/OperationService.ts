/**
 * Servicio para realizar operaciones de operations (operaciones diarias)
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  OperationListResponseDto,
  OperationCreateRequestDto,
  OperationUpdateRequestDto,
  OperationPublishRequestDto,
  OperationResponseDto,
} from '../dto';

export class OperationService {
  /**
   * Obtiene todas las operaciones
   * @param date Fecha para filtrar operaciones (YYYY-MM-DD)
   * @returns Promise con la lista de operaciones
   */
  async getAll(date?: string): Promise<OperationListResponseDto> {
    try {
      let url = API_ENDPOINTS.OPERATIONS.BASE;
      if (date) {
        url += `?date=${date}`;
      }
      const response = await httpService.get<OperationListResponseDto>(url);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener operaciones: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene una operación por ID
   * @param id ID de la operación
   * @returns Promise con la operación
   */
  async getById(id: string): Promise<OperationResponseDto> {
    try {
      const response = await httpService.get<OperationResponseDto>(
        API_ENDPOINTS.OPERATIONS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva operación
   * @param operationData Datos de la operación a crear
   * @returns Promise con la operación creada
   */
  async create(operationData: OperationCreateRequestDto): Promise<OperationResponseDto> {
    try {
      const response = await httpService.post<OperationResponseDto>(
        API_ENDPOINTS.OPERATIONS.BASE,
        operationData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una operación existente
   * @param id ID de la operación a actualizar
   * @param operationData Datos actualizados de la operación
   * @returns Promise con la operación actualizada
   */
  async update(
    id: string,
    operationData: OperationUpdateRequestDto
  ): Promise<OperationResponseDto> {
    try {
      const response = await httpService.put<OperationResponseDto>(
        API_ENDPOINTS.OPERATIONS.BY_ID(id),
        operationData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Publica una operación (cambia el estado)
   * @param id ID de la operación
   * @param publishData Datos para publicar
   * @returns Promise con la operación actualizada
   */
  async publish(
    id: string,
    publishData: OperationPublishRequestDto
  ): Promise<OperationResponseDto> {
    try {
      const response = await httpService.post<OperationResponseDto>(
        API_ENDPOINTS.OPERATIONS.PUBLISH(id),
        publishData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al publicar operación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const operationService = new OperationService();

