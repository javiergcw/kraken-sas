/**
 * DTOs para responses de plantillas de contratos
 */

export interface TemplateVariableDto {
  id: string;
  template_id: string;
  key: string;
  label: string;
  description?: string;
  data_type: 'TEXT' | 'NUMBER' | 'DATE' | 'SIGNATURE' | 'EMAIL';
  required: boolean;
  default_value?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplateDto {
  id: string;
  company_id: string;
  name: string;
  sku: string;
  description?: string;
  html_content: string;
  is_active: boolean;
  variables?: TemplateVariableDto[];
  created_at: string;
  updated_at: string;
}

export interface ContractTemplatesResponseDto {
  success: boolean;
  data: ContractTemplateDto[];
}

export interface ContractTemplateResponseDto {
  success: boolean;
  message?: string;
  data: ContractTemplateDto;
}

export interface ContractTemplateDeleteResponseDto {
  success: boolean;
  message: string;
}

export interface TemplateVariableResponseDto {
  success: boolean;
  message?: string;
  data: TemplateVariableDto;
}

export interface TemplateVariableDeleteResponseDto {
  success: boolean;
  message: string;
}

