/**
 * Controlador para operations (operaciones diarias)
 * Expone los métodos de operations a los componentes
 */

import {
  getAllOperationsUseCase,
  getOperationByIdUseCase,
  createOperationUseCase,
  updateOperationUseCase,
  publishOperationUseCase,
} from '../use-cases';
import {
  OperationListResponseDto,
  OperationResponseDto,
  OperationCreateRequestDto,
  OperationUpdateRequestDto,
  OperationPublishRequestDto,
} from '../dto';

export class OperationController {
  /**
   * Obtiene todas las operaciones
   */
  async getAll(date?: string): Promise<OperationListResponseDto | null> {
    try {
      return await getAllOperationsUseCase.execute(date);
    } catch (error) {
      console.error('Error al obtener operaciones:', error);
      return null;
    }
  }

  /**
   * Obtiene una operación por ID
   */
  async getById(id: string): Promise<OperationResponseDto | null> {
    try {
      return await getOperationByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error al obtener operación:', error);
      return null;
    }
  }

  /**
   * Crea una nueva operación
   */
  async create(operationData: OperationCreateRequestDto): Promise<OperationResponseDto | null> {
    try {
      return await createOperationUseCase.execute(operationData);
    } catch (error) {
      console.error('Error al crear operación:', error);
      return null;
    }
  }

  /**
   * Actualiza una operación existente
   */
  async update(
    id: string,
    operationData: OperationUpdateRequestDto
  ): Promise<OperationResponseDto | null> {
    try {
      return await updateOperationUseCase.execute(id, operationData);
    } catch (error) {
      console.error('Error al actualizar operación:', error);
      return null;
    }
  }

  /**
   * Publica una operación (cambia el estado)
   */
  async publish(
    id: string,
    publishData: OperationPublishRequestDto
  ): Promise<OperationResponseDto | null> {
    try {
      return await publishOperationUseCase.execute(id, publishData);
    } catch (error) {
      console.error('Error al publicar operación:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const operationController = new OperationController();

