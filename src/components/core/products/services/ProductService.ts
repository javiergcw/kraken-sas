/**
 * Servicio para realizar operaciones de productos
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ProductsResponseDto,
  ProductCreateRequestDto,
  ProductUpdateRequestDto,
  ProductResponseDto,
  ProductDeleteResponseDto,
} from '../dto';

export class ProductService {
  /**
   * Obtiene todos los productos
   * @returns Promise con la lista de productos
   */
  async getAll(): Promise<ProductsResponseDto> {
    try {
      const response = await httpService.get<ProductsResponseDto>(
        API_ENDPOINTS.PRODUCTS.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener productos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene un producto por ID
   * @param id ID del producto
   * @returns Promise con el producto
   */
  async getById(id: string): Promise<ProductResponseDto> {
    try {
      const response = await httpService.get<ProductResponseDto>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener producto: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea un nuevo producto
   * @param productData Datos del producto a crear
   * @returns Promise con el producto creado
   */
  async create(productData: ProductCreateRequestDto): Promise<ProductResponseDto> {
    try {
      const response = await httpService.post<ProductResponseDto>(
        API_ENDPOINTS.PRODUCTS.BASE,
        productData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear producto: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza un producto existente
   * @param id ID del producto a actualizar
   * @param productData Datos actualizados del producto
   * @returns Promise con el producto actualizado
   */
  async update(
    id: string,
    productData: ProductUpdateRequestDto
  ): Promise<ProductResponseDto> {
    try {
      const response = await httpService.put<ProductResponseDto>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        productData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar producto: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Elimina un producto
   * @param id ID del producto a eliminar
   * @returns Promise con la confirmación de eliminación
   */
  async delete(id: string): Promise<ProductDeleteResponseDto> {
    try {
      const response = await httpService.delete<ProductDeleteResponseDto>(
        API_ENDPOINTS.PRODUCTS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar producto: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const productService = new ProductService();

