import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
    ProductAssociationsResponseDto,
    ProductAssociationResponseDto,
    CreateProductAssociationDto,
    UpdateProductAssociationDto,
} from '../dto/ProductAssociation.dto'; // Adjusted import path

export class ProductAssociationService {
    async getAll(token?: string): Promise<ProductAssociationsResponseDto> {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await httpService.get<ProductAssociationsResponseDto>(
                API_ENDPOINTS.PRODUCT_ASSOCIATIONS.BASE,
                {
                    params: { include: 'relations' },
                    headers
                }
            );
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(
                `Error fetching product associations: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async create(data: CreateProductAssociationDto): Promise<ProductAssociationResponseDto> {
        try {
            const response = await httpService.post<ProductAssociationResponseDto>(
                API_ENDPOINTS.PRODUCT_ASSOCIATIONS.BASE,
                data
            );
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(
                `Error creating product association: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async update(id: string, data: UpdateProductAssociationDto): Promise<ProductAssociationResponseDto> {
        try {
            // NOTE: The user requested the endpoint to be /product-associations/:id_product
            // However, typically updates are by the Association ID.
            // I will implement it as requested using the ID passed to this function.
            // If the ID passed is indeed the product ID as per the request requirement, this works.
            // But usually you update a resource by its own ID.
            // Requirement said: {{URL}}/api/v1/product-associations/:id_product

            const response = await httpService.put<ProductAssociationResponseDto>(
                API_ENDPOINTS.PRODUCT_ASSOCIATIONS.BY_PRODUCT_ID(id),
                data
            );
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(
                `Error updating product association: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}

export const productAssociationService = new ProductAssociationService();
