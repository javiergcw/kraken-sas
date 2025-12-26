/**
 * DTOs para responses de contratos emitidos
 */

export interface ContractDto {
  id: string;
  template_id: string;
  sku: string;
  code: string;
  access_token?: string;
  status: 'DRAFT' | 'PENDING_SIGN' | 'SIGNED' | 'EXPIRED' | 'CANCELLED';
  html_snapshot?: string;
  pdf_path?: string | null;
  related_type?: 'RESERVATION' | 'PRODUCT' | 'VESSEL' | 'RENT' | 'SALE' | null;
  related_id?: string | null;
  
  // Campos de firma
  signed_by_name?: string | null;
  signed_by_email?: string | null;
  signed_at?: string | null;
  
  // Campos básicos (ahora vienen directamente en el objeto, no en fields)
  email?: string | null;
  signer_name?: string | null;
  identity_type?: string | null;
  identity_number?: string | null;
  company?: string | null;
  signature?: string | null;
  
  // Información General (23 campos)
  general_info_first_name?: string | null;
  general_info_last_name?: string | null;
  general_info_nationality?: string | null;
  general_info_document_type?: string | null;
  general_info_document_number?: string | null;
  general_info_email?: string | null;
  general_info_phone?: string | null;
  general_info_address?: string | null;
  general_info_address_additional?: string | null;
  general_info_address_city?: string | null;
  general_info_address_state?: string | null;
  general_info_address_zip_code?: string | null;
  general_info_address_country?: string | null;
  general_info_birth_date?: string | null;
  general_info_certification_level?: string | null;
  general_info_dive_count?: number | null;
  general_info_how_did_you_know?: string | null;
  general_info_accommodation?: string | null;
  general_info_activity?: string | null;
  general_info_activity_start_date?: string | null;
  general_info_height?: number | null;
  general_info_weight?: number | null;
  general_info_shoe_size?: string | null;
  general_info_special_requirements?: string | null;
  
  // Contacto de Emergencia (4 campos)
  emergency_contact_first_name?: string | null;
  emergency_contact_last_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_email?: string | null;
  
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
  
  // Campos adicionales para compatibilidad
  company_id?: string;
  pdf_url?: string;
  signature_image?: string;
  public_token?: string;
  fields?: Record<string, any>;
}

export interface ContractsResponseDto {
  success: boolean;
  data: ContractDto[];
}

export interface ContractResponseDto {
  success: boolean;
  message?: string;
  data: ContractDto;
}

export interface ContractDeleteResponseDto {
  success: boolean;
  message: string;
}

export interface ContractSignResponseDto {
  success: boolean;
  message: string;
  data: ContractDto;
}

export interface ContractInvalidateResponseDto {
  success: boolean;
  message: string;
}

export interface ContractPDFResponseDto {
  success: boolean;
  message?: string;
  data: {
    url: string;
  };
}

// Para acceso público (sin autenticación)
export interface PublicContractResponseDto {
  success: boolean;
  data: {
    contract: ContractDto;
    template_html: string;
  };
}

export interface PublicContractStatusResponseDto {
  success: boolean;
  data: {
    status: 'DRAFT' | 'PENDING' | 'SIGNED' | 'EXPIRED' | 'CANCELLED';
    signed_at?: string;
    expires_at?: string;
  };
}

