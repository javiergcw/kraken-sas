/**
 * DTOs para responses de contratos emitidos
 */

export interface ContractDto {
  id: string;
  company_id: string;
  template_id: string;
  sku: string;
  code: string;
  related_type?: 'RESERVATION' | 'PRODUCT' | 'SERVICE' | 'OTHER';
  related_id?: string;
  status: 'DRAFT' | 'PENDING_SIGN' | 'SIGNED' | 'EXPIRED' | 'CANCELLED';
  signer_name: string;
  signer_email: string;
  fields: Record<string, any>;
  signed_by_name?: string;
  signed_by_email?: string;
  signed_at?: string;
  signature_image?: string;
  expires_at?: string;
  pdf_url?: string;
  pdf_path?: string;
  html_snapshot?: string;
  public_token?: string;
  access_token?: string;
  created_at: string;
  updated_at: string;
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

