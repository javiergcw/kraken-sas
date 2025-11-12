/**
 * Caso de uso para obtener todas las categorías
 */

import { categoryService } from '../services/CategoryService';
import { CategoriesResponseDto } from '../dto';

export class GetAllCategoriesUseCase {
  /**
   * Ejecuta la obtención de todas las categorías
   * @returns Promise con la lista de categorías
   */
  async execute(): Promise<CategoriesResponseDto> {
    try {
      const response = await categoryService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllCategoriesUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const getAllCategoriesUseCase = new GetAllCategoriesUseCase();

