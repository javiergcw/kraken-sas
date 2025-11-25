/**
 * Controlador para vessels (buques)
 * Expone los métodos de vessels a los componentes
 */

import {
  getAllVesselsUseCase,
  createVesselUseCase,
  updateVesselUseCase,
} from '../use-cases';
import {
  VesselListResponseDto,
  VesselResponseDto,
  VesselCreateRequestDto,
  VesselUpdateRequestDto,
} from '../dto';

export class VesselController {
  /**
   * Obtiene todos los buques
   */
  async getAll(active?: boolean): Promise<VesselListResponseDto | null> {
    try {
      return await getAllVesselsUseCase.execute(active);
    } catch (error) {
      console.error('Error al obtener buques:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo buque
   */
  async create(vesselData: VesselCreateRequestDto): Promise<VesselResponseDto | null> {
    try {
      return await createVesselUseCase.execute(vesselData);
    } catch (error) {
      console.error('Error al crear buque:', error);
      return null;
    }
  }

  /**
   * Actualiza un buque existente
   */
  async update(
    id: string,
    vesselData: VesselUpdateRequestDto
  ): Promise<VesselResponseDto | null> {
    try {
      return await updateVesselUseCase.execute(id, vesselData);
    } catch (error) {
      console.error('Error al actualizar buque:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const vesselController = new VesselController();

