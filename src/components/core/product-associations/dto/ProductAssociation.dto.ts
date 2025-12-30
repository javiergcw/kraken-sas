export interface Product {
    id: string;
    sku: string;
    name: string;
}

export interface ContractTemplate {
    id: string;
    sku: string;
    name: string;
    description: string;
    is_active: boolean;
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
    contract_template_id: string;
    activity_id: string;
    created_at: string;
    updated_at: string;
    product: Product;
    contract_template: ContractTemplate;
    activity: Activity;
}

export interface CreateProductAssociationDto {
    product_id: string;
    contract_template_id: string;
    activity_id: string;
}

export interface UpdateProductAssociationDto {
    contract_template_id: string;
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
