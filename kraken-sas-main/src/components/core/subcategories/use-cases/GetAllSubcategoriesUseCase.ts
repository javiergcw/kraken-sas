/**
 * Caso de uso para obtener todas las subcategorías
 */

import { subcategoryService } from '../services/SubcategoryService';
import { SubcategoriesResponseDto } from '../dto';

export class GetAllSubcategoriesUseCase {
  /**
   * Ejecuta la obtención de todas las subcategorías
   * @returns Promise con la lista de subcategorías
   */
  async execute(): Promise<SubcategoriesResponseDto> {
    try {
      const response = await subcategoryService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllSubcategoriesUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const getAllSubcategoriesUseCase = new GetAllSubcategoriesUseCase();

