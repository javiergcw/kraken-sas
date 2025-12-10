export interface Product {
    id: string;
    sku: string;
    name: string;
}

export interface Contract {
    id: string;
    sku: string;
    code: string;
    status: string;
}

export interface Activity {
    id: string;
    code: string;
    description: string;
}

export interface ProductAssociation {
    id: string;
    company_id: string;
    product_id: string;
    contract_id: string;
    activity_id: string;
    created_at: string;
    updated_at: string;
    product: Product;
    contract: Contract;
    activity: Activity;
}

export interface CreateProductAssociationDto {
    product_id: string;
    contract_id: string;
    activity_id: string;
}

export interface UpdateProductAssociationDto {
    contract_id: string;
    activity_id: string;
}

export interface ProductAssociationsResponseDto {
    success: boolean;
    data: ProductAssociation[];
}

export interface ProductAssociationResponseDto {
    success: boolean;
    data: ProductAssociation;
}
