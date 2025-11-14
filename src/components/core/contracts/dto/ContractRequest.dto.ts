/**
 * DTOs para requests de contratos emitidos
 */

export interface ContractCreateRequestDto {
  template_id: string;
  sku: string;
  related_type?: 'RESERVATION' | 'PRODUCT' | 'VESSEL' | 'RENT';
  related_id?: string;
  code?: string;
  expires_at?: string;
  signer_name: string;
  signer_email: string;
  fields: Record<string, any>;
}

export interface ContractSignRequestDto {
  signed_by_name: string;
  signed_by_email: string;
  signature_image: string;
  signed_fields?: Record<string, any>;
}

export interface ContractInvalidateRequestDto {
  reason: string;
  invalidate_all_tokens?: boolean;
}

export interface ContractGeneratePDFRequestDto {
  format?: 'pdf' | 'html';
  force_regenerate?: boolean;
  notify_signer?: boolean;
  notes?: string;
}

