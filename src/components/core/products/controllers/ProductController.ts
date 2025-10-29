/**
 * Controlador para productos
 * Expone los métodos de productos a los componentes
 */

import {
  getAllProductsUseCase,
  getProductByIdUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} from '../use-cases';
import {
  ProductsResponseDto,
  ProductResponseDto,
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  ProductDeleteResponseDto,
} from '../dto';

export class ProductController {
  /**
   * Obtiene todos los productos
   */
  async getAll(): Promise<ProductsResponseDto | null> {
    try {
      return await getAllProductsUseCase.execute();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return null;
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getById(id: string): Promise<ProductResponseDto | null> {
    try {
      return await getProductByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo producto
   */
  async create(productData: ProductCreateRequestDto): Promise<ProductResponseDto | null> {
    try {
      return await createProductUseCase.execute(productData);
    } catch (error) {
      console.error('Error al crear producto:', error);
      return null;
    }
  }

  /**
   * Actualiza un producto existente
   */
  async update(
    id: string,
    productData: ProductUpdateRequestDto
  ): Promise<ProductResponseDto | null> {
    try {
      return await updateProductUseCase.execute(id, productData);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return null;
    }
  }

  /**
   * Elimina un producto
   */
  async delete(id: string): Promise<ProductDeleteResponseDto | null> {
    try {
      return await deleteProductUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const productController = new ProductController();

