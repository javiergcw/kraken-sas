/**
 * DTOs para requests de contratos emitidos
 */

/**
 * Variables disponibles para usar en plantillas de contratos
 * 
 * Formato de uso en HTML: %variable_name%
 * Ejemplo: %email%, %signer_name%, %general_info_first_name%
 * 
 * CAMPOS BÁSICOS:
 * - %email% - Email
 * - %signer_name% - Nombre del que firma
 * - %identity_type% - Tipo de identidad (CC, NIT, etc.)
 * - %identity_number% - Número de identidad
 * - %company% - Empresa
 * - %signature% - Firma (se convierte en tag <img> HTML)
 * 
 * INFORMACIÓN GENERAL - Sección 1:
 * - %general_info_first_name% - 1.1 Nombre
 * - %general_info_last_name% - 1.2 Apellido
 * - %general_info_nationality% - 1.3 Nacionalidad
 * - %general_info_document_type% - 1.4 Tipo de documento
 * - %general_info_document_number% - 1.5 Número de documento
 * - %general_info_email% - 1.6 Correo electrónico/email
 * - %general_info_phone% - 1.7 Celular/WhatsApp
 * - %general_info_address% - 1.8 Dirección de correspondencia
 * - %general_info_address_additional% - 1.9 Dirección - Información adicional
 * - %general_info_address_city% - 1.10 Dirección - Ciudad
 * - %general_info_address_state% - 1.11 Dirección - Estado
 * - %general_info_address_zip_code% - 1.12 Dirección - Código postal
 * - %general_info_address_country% - 1.13 Dirección - País
 * - %general_info_birth_date% - 1.14 Fecha de nacimiento (formato: YYYY-MM-DD)
 * - %general_info_certification_level% - 1.15 Nivel de certificación actual
 * - %general_info_dive_count% - 1.15 Cantidad de buceos / Logbook dives (número)
 * - %general_info_how_did_you_know% - 1.16 Cómo supo de nosotros
 * - %general_info_accommodation% - 1.17 Lugar de hospedaje
 * - %general_info_activity% - 1.18 Actividad a tomar
 * - %general_info_activity_start_date% - 1.19 Fecha de inicio de la actividad (formato: YYYY-MM-DD)
 * - %general_info_height% - 1.20 Estatura (centímetros, número)
 * - %general_info_weight% - 1.21 Peso (kilogramos, número decimal)
 * - %general_info_shoe_size% - 1.22 Talla de calzado (texto)
 * - %general_info_special_requirements% - 1.23 Requerimientos especiales (texto largo)
 * 
 * CONTACTO DE EMERGENCIA - Sección 2:
 * - %emergency_contact_first_name% - 2.1 Nombre
 * - %emergency_contact_last_name% - 2.2 Apellido
 * - %emergency_contact_phone% - 2.3 Número de teléfono
 * - %emergency_contact_email% - 2.4 Correo electrónico
 */

/**
 * Campos opcionales que pueden incluirse en el objeto fields
 * Todas estas variables pueden usarse en las plantillas HTML con el formato %variable_name%
 */
export interface ContractFieldsDto {
  // Campos básicos originales (opcionales)
  // %email% - Email
  email?: string;
  // %signer_name% - Nombre del que firma
  signer_name?: string;
  // %identity_type% - Tipo de identidad (CC, NIT, etc.)
  identity_type?: string;
  // %identity_number% - Número de identidad
  identity_number?: string;
  // %company% - Empresa
  company?: string;
  // %signature% - Firma (se convierte en tag <img> HTML)
  signature?: string; // data:image/png;base64,...

  // Información General - Sección 1 (23 campos opcionales)
  // %general_info_first_name% - 1.1 Nombre
  general_info_first_name?: string;
  // %general_info_last_name% - 1.2 Apellido
  general_info_last_name?: string;
  // %general_info_nationality% - 1.3 Nacionalidad
  general_info_nationality?: string;
  // %general_info_document_type% - 1.4 Tipo de documento
  general_info_document_type?: string;
  // %general_info_document_number% - 1.5 Número de documento
  general_info_document_number?: string;
  // %general_info_email% - 1.6 Correo electrónico/email
  general_info_email?: string;
  // %general_info_phone% - 1.7 Celular/WhatsApp
  general_info_phone?: string;
  // %general_info_address% - 1.8 Dirección de correspondencia
  general_info_address?: string;
  // %general_info_address_additional% - 1.9 Dirección - Información adicional
  general_info_address_additional?: string;
  // %general_info_address_city% - 1.10 Dirección - Ciudad
  general_info_address_city?: string;
  // %general_info_address_state% - 1.11 Dirección - Estado
  general_info_address_state?: string;
  // %general_info_address_zip_code% - 1.12 Dirección - Código postal
  general_info_address_zip_code?: string;
  // %general_info_address_country% - 1.13 Dirección - País
  general_info_address_country?: string;
  // %general_info_birth_date% - 1.14 Fecha de nacimiento (formato: YYYY-MM-DD)
  general_info_birth_date?: string;
  // %general_info_certification_level% - 1.15 Nivel de certificación actual
  general_info_certification_level?: string;
  // %general_info_dive_count% - 1.15 Cantidad de buceos / Logbook dives (número)
  general_info_dive_count?: number;
  // %general_info_how_did_you_know% - 1.16 Cómo supo de nosotros
  general_info_how_did_you_know?: string;
  // %general_info_accommodation% - 1.17 Lugar de hospedaje
  general_info_accommodation?: string;
  // %general_info_activity% - 1.18 Actividad a tomar
  general_info_activity?: string;
  // %general_info_activity_start_date% - 1.19 Fecha de inicio de la actividad (formato: YYYY-MM-DD)
  general_info_activity_start_date?: string;
  // %general_info_height% - 1.20 Estatura (centímetros, número)
  general_info_height?: number;
  // %general_info_weight% - 1.21 Peso (kilogramos, número decimal)
  general_info_weight?: number;
  // %general_info_shoe_size% - 1.22 Talla de calzado (texto)
  general_info_shoe_size?: string;
  // %general_info_special_requirements% - 1.23 Requerimientos especiales (texto largo)
  general_info_special_requirements?: string;

  // Contacto de Emergencia - Sección 2 (4 campos opcionales)
  // %emergency_contact_first_name% - 2.1 Nombre
  emergency_contact_first_name?: string;
  // %emergency_contact_last_name% - 2.2 Apellido
  emergency_contact_last_name?: string;
  // %emergency_contact_phone% - 2.3 Número de teléfono
  emergency_contact_phone?: string;
  // %emergency_contact_email% - 2.4 Correo electrónico
  emergency_contact_email?: string;

  // Permite campos adicionales personalizados
  [key: string]: any;
}

export interface ContractCreateRequestDto {
  template_id: string;
  sku: string;
  code?: string;
  related_type?: 'RESERVATION' | 'PRODUCT' | 'VESSEL' | 'RENT';
  related_id?: string;
  expires_at?: string;
  fields: ContractFieldsDto;
}

/**
 * DTO para firmar un contrato
 * Solo requiere un objeto fields con signer_name y email como requeridos
 * Todas las demás variables son opcionales y pueden usarse en plantillas con %variable_name%
 */
export interface ContractSignRequestDto {
  fields: {
    // REQUERIDOS
    // %signer_name% - Nombre del que firma
    signer_name: string;
    // %email% - Email
    email: string;
    
    // Campos básicos originales (opcionales)
    // %identity_type% - Tipo de identidad (CC, NIT, etc.)
    identity_type?: string;
    // %identity_number% - Número de identidad
    identity_number?: string;
    // %company% - Empresa
    company?: string;
    // %signature% - Firma (se convierte en tag <img> HTML)
    signature?: string; // data:image/png;base64,...
    
    // Información General - Sección 1 (23 campos opcionales)
    // %general_info_first_name% - 1.1 Nombre
    general_info_first_name?: string;
    // %general_info_last_name% - 1.2 Apellido
    general_info_last_name?: string;
    // %general_info_nationality% - 1.3 Nacionalidad
    general_info_nationality?: string;
    // %general_info_document_type% - 1.4 Tipo de documento
    general_info_document_type?: string;
    // %general_info_document_number% - 1.5 Número de documento
    general_info_document_number?: string;
    // %general_info_email% - 1.6 Correo electrónico/email
    general_info_email?: string;
    // %general_info_phone% - 1.7 Celular/WhatsApp
    general_info_phone?: string;
    // %general_info_address% - 1.8 Dirección de correspondencia
    general_info_address?: string;
    // %general_info_address_additional% - 1.9 Dirección - Información adicional
    general_info_address_additional?: string;
    // %general_info_address_city% - 1.10 Dirección - Ciudad
    general_info_address_city?: string;
    // %general_info_address_state% - 1.11 Dirección - Estado
    general_info_address_state?: string;
    // %general_info_address_zip_code% - 1.12 Dirección - Código postal
    general_info_address_zip_code?: string;
    // %general_info_address_country% - 1.13 Dirección - País
    general_info_address_country?: string;
    // %general_info_birth_date% - 1.14 Fecha de nacimiento (formato: YYYY-MM-DD)
    general_info_birth_date?: string;
    // %general_info_certification_level% - 1.15 Nivel de certificación actual
    general_info_certification_level?: string;
    // %general_info_dive_count% - 1.15 Cantidad de buceos / Logbook dives (número)
    general_info_dive_count?: number;
    // %general_info_how_did_you_know% - 1.16 Cómo supo de nosotros
    general_info_how_did_you_know?: string;
    // %general_info_accommodation% - 1.17 Lugar de hospedaje
    general_info_accommodation?: string;
    // %general_info_activity% - 1.18 Actividad a tomar
    general_info_activity?: string;
    // %general_info_activity_start_date% - 1.19 Fecha de inicio de la actividad (formato: YYYY-MM-DD)
    general_info_activity_start_date?: string;
    // %general_info_height% - 1.20 Estatura (centímetros, número)
    general_info_height?: number;
    // %general_info_weight% - 1.21 Peso (kilogramos, número decimal)
    general_info_weight?: number;
    // %general_info_shoe_size% - 1.22 Talla de calzado (texto)
    general_info_shoe_size?: string;
    // %general_info_special_requirements% - 1.23 Requerimientos especiales (texto largo)
    general_info_special_requirements?: string;
    
    // Contacto de Emergencia - Sección 2 (4 campos opcionales)
    // %emergency_contact_first_name% - 2.1 Nombre
    emergency_contact_first_name?: string;
    // %emergency_contact_last_name% - 2.2 Apellido
    emergency_contact_last_name?: string;
    // %emergency_contact_phone% - 2.3 Número de teléfono
    emergency_contact_phone?: string;
    // %emergency_contact_email% - 2.4 Correo electrónico
    emergency_contact_email?: string;
    
    // Permite campos adicionales personalizados
    [key: string]: any;
  };
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

