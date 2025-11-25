/**
 * Controlador para marinas
 * Expone los métodos de marinas a los componentes
 */

import {
  getAllMarinasUseCase,
  createMarinaUseCase,
  updateMarinaUseCase,
} from '../use-cases';
import {
  MarinaListResponseDto,
  MarinaResponseDto,
  MarinaCreateRequestDto,
  MarinaUpdateRequestDto,
} from '../dto';

export class MarinaController {
  /**
   * Obtiene todas las marinas
   */
  async getAll(active?: boolean): Promise<MarinaListResponseDto | null> {
    try {
      return await getAllMarinasUseCase.execute(active);
    } catch (error) {
      console.error('Error al obtener marinas:', error);
      return null;
    }
  }

  /**
   * Crea una nueva marina
   */
  async create(marinaData: MarinaCreateRequestDto): Promise<MarinaResponseDto | null> {
    try {
      return await createMarinaUseCase.execute(marinaData);
    } catch (error) {
      console.error('Error al crear marina:', error);
      return null;
    }
  }

  /**
   * Actualiza una marina existente
   */
  async update(
    id: string,
    marinaData: MarinaUpdateRequestDto
  ): Promise<MarinaResponseDto | null> {
    try {
      return await updateMarinaUseCase.execute(id, marinaData);
    } catch (error) {
      console.error('Error al actualizar marina:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const marinaController = new MarinaController();

