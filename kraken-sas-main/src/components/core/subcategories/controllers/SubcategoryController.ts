/**
 * Controlador para subcategorías
 */

import {
  getAllSubcategoriesUseCase,
  createSubcategoryUseCase,
  updateSubcategoryUseCase,
  deleteSubcategoryUseCase,
} from '../use-cases';
import {
  SubcategoriesResponseDto,
  SubcategoryCreateRequestDto,
  SubcategoryUpdateRequestDto,
  SubcategoryResponseDto,
  SubcategoryDeleteResponseDto,
} from '../dto';

export class SubcategoryController {
  /**
   * Obtiene todas las subcategorías
   * @returns Promise con la lista de subcategorías o null en caso de error
   */
  async getAll(): Promise<SubcategoriesResponseDto | null> {
    try {
      return await getAllSubcategoriesUseCase.execute();
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      return null;
    }
  }

  /**
   * Crea una nueva subcategoría
   * @param subcategoryData Datos de la subcategoría a crear
   * @returns Promise con la subcategoría creada o null en caso de error
   */
  async create(subcategoryData: SubcategoryCreateRequestDto): Promise<SubcategoryResponseDto | null> {
    try {
      return await createSubcategoryUseCase.execute(subcategoryData);
    } catch (error) {
      console.error('Error al crear subcategoría:', error);
      return null;
    }
  }

  /**
   * Actualiza una subcategoría existente
   * @param id ID de la subcategoría a actualizar
   * @param subcategoryData Datos actualizados de la subcategoría
   * @returns Promise con la subcategoría actualizada o null en caso de error
   */
  async update(
    id: string,
    subcategoryData: SubcategoryUpdateRequestDto
  ): Promise<SubcategoryResponseDto | null> {
    try {
      return await updateSubcategoryUseCase.execute(id, subcategoryData);
    } catch (error) {
      console.error('Error al actualizar subcategoría:', error);
      return null;
    }
  }

  /**
   * Elimina una subcategoría
   * @param id ID de la subcategoría a eliminar
   * @returns Promise con la confirmación de eliminación o null en caso de error
   */
  async delete(id: string): Promise<SubcategoryDeleteResponseDto | null> {
    try {
      return await deleteSubcategoryUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar subcategoría:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const subcategoryController = new SubcategoryController();

