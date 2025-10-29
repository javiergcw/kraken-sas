/**
 * Caso de uso para crear una subcategoría
 */

import { subcategoryService } from '../services/SubcategoryService';
import { SubcategoryCreateRequestDto, SubcategoryResponseDto } from '../dto';

export class CreateSubcategoryUseCase {
  /**
   * Ejecuta la creación de una subcategoría
   * @param subcategoryData Datos de la subcategoría a crear
   * @returns Promise con la subcategoría creada
   */
  async execute(subcategoryData: SubcategoryCreateRequestDto): Promise<SubcategoryResponseDto> {
    try {
      const response = await subcategoryService.create(subcategoryData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateSubcategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const createSubcategoryUseCase = new CreateSubcategoryUseCase();

