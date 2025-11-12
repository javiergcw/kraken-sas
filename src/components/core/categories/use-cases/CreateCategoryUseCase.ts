/**
 * Caso de uso para crear una categoría
 */

import { categoryService } from '../services/CategoryService';
import { CategoryCreateRequestDto, CategoryResponseDto } from '../dto';

export class CreateCategoryUseCase {
  /**
   * Ejecuta la creación de una categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Promise con la categoría creada
   */
  async execute(categoryData: CategoryCreateRequestDto): Promise<CategoryResponseDto> {
    try {
      const response = await categoryService.create(categoryData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateCategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const createCategoryUseCase = new CreateCategoryUseCase();

