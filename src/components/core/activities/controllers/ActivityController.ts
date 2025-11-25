/**
 * Controlador para activities
 * Expone los métodos de activities a los componentes
 */

import {
  getAllActivitiesUseCase,
  createActivityUseCase,
  updateActivityUseCase,
} from '../use-cases';
import {
  ActivityListResponseDto,
  ActivityResponseDto,
  ActivityCreateRequestDto,
  ActivityUpdateRequestDto,
} from '../dto';

export class ActivityController {
  /**
   * Obtiene todas las actividades
   */
  async getAll(active?: boolean): Promise<ActivityListResponseDto | null> {
    try {
      return await getAllActivitiesUseCase.execute(active);
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      return null;
    }
  }

  /**
   * Crea una nueva actividad
   */
  async create(activityData: ActivityCreateRequestDto): Promise<ActivityResponseDto | null> {
    try {
      return await createActivityUseCase.execute(activityData);
    } catch (error) {
      console.error('Error al crear actividad:', error);
      return null;
    }
  }

  /**
   * Actualiza una actividad existente
   */
  async update(
    id: string,
    activityData: ActivityUpdateRequestDto
  ): Promise<ActivityResponseDto | null> {
    try {
      return await updateActivityUseCase.execute(id, activityData);
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const activityController = new ActivityController();

