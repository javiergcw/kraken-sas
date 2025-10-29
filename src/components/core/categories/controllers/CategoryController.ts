/**
 * Controlador para categorías
 */

import {
  getAllCategoriesUseCase,
  createCategoryUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase,
} from '../use-cases';
import {
  CategoriesResponseDto,
  CategoryCreateRequestDto,
  CategoryUpdateRequestDto,
  CategoryResponseDto,
  CategoryDeleteResponseDto,
} from '../dto';

export class CategoryController {
  /**
   * Obtiene todas las categorías
   * @returns Promise con la lista de categorías o null en caso de error
   */
  async getAll(): Promise<CategoriesResponseDto | null> {
    try {
      return await getAllCategoriesUseCase.execute();
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return null;
    }
  }

  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Promise con la categoría creada o null en caso de error
   */
  async create(categoryData: CategoryCreateRequestDto): Promise<CategoryResponseDto | null> {
    try {
      return await createCategoryUseCase.execute(categoryData);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return null;
    }
  }

  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param categoryData Datos actualizados de la categoría
   * @returns Promise con la categoría actualizada o null en caso de error
   */
  async update(
    id: string,
    categoryData: CategoryUpdateRequestDto
  ): Promise<CategoryResponseDto | null> {
    try {
      return await updateCategoryUseCase.execute(id, categoryData);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      return null;
    }
  }

  /**
   * Elimina una categoría
   * @param id ID de la categoría a eliminar
   * @returns Promise con la confirmación de eliminación o null en caso de error
   */
  async delete(id: string): Promise<CategoryDeleteResponseDto | null> {
    try {
      return await deleteCategoryUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const categoryController = new CategoryController();

