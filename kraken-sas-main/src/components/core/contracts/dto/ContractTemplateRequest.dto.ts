/**
 * DTOs para requests de plantillas de contratos
 */

export interface TemplateVariableDto {
  key: string;
  label: string;
  description?: string;
  data_type: 'TEXT' | 'NUMBER' | 'DATE' | 'SIGNATURE' | 'EMAIL';
  required: boolean;
  default_value?: string;
  sort_order?: number;
}

export interface ContractTemplateCreateRequestDto {
  name: string;
  sku: string;
  description?: string;
  html_content: string;
  variables?: TemplateVariableDto[];
}

export interface ContractTemplateUpdateRequestDto {
  name?: string;
  description?: string;
  html_content?: string;
  is_active?: boolean;
}

export interface TemplateVariableCreateRequestDto {
  key: string;
  label: string;
  description?: string;
  data_type: 'TEXT' | 'NUMBER' | 'DATE' | 'SIGNATURE' | 'EMAIL';
  required: boolean;
  default_value?: string;
  sort_order?: number;
}

export interface TemplateVariableUpdateRequestDto {
  label?: string;
  description?: string;
  data_type?: 'TEXT' | 'NUMBER' | 'DATE' | 'SIGNATURE' | 'EMAIL';
  required?: boolean;
  default_value?: string;
  sort_order?: number;
}

