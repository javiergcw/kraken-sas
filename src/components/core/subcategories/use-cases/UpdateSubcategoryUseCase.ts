/**
 * Caso de uso para actualizar una subcategoría
 */

import { subcategoryService } from '../services/SubcategoryService';
import { SubcategoryUpdateRequestDto, SubcategoryResponseDto } from '../dto';

export class UpdateSubcategoryUseCase {
  /**
   * Ejecuta la actualización de una subcategoría
   * @param id ID de la subcategoría a actualizar
   * @param subcategoryData Datos actualizados de la subcategoría
   * @returns Promise con la subcategoría actualizada
   */
  async execute(id: string, subcategoryData: SubcategoryUpdateRequestDto): Promise<SubcategoryResponseDto> {
    try {
      const response = await subcategoryService.update(id, subcategoryData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateSubcategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const updateSubcategoryUseCase = new UpdateSubcategoryUseCase();

