/**
 * Caso de uso para actualizar un producto
 */

import { productService } from '../services';
import { ProductUpdateRequestDto, ProductResponseDto } from '../dto';

export class UpdateProductUseCase {
  constructor(
    private readonly service = productService
  ) {}

  async execute(id: string, productData: ProductUpdateRequestDto): Promise<ProductResponseDto> {
    try {
      const response = await this.service.update(id, productData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateProductUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateProductUseCase = new UpdateProductUseCase();

