import { contractService } from '../../services/ContractService';
import { ContractResponseDto, ContractDto } from '../../dto';

export class GetContractByIdUseCase {
  async execute(id: string): Promise<ContractResponseDto> {
    try {
      const response = await contractService.getById(id);
      
      // Si la respuesta ya tiene la estructura esperada con contract anidado, retornarla directamente
      if (response?.data?.contract) {
        return response;
      }
      
      // Si la respuesta tiene el contrato directamente en data (nueva estructura del backend)
      if (response?.success && response?.data) {
        // Verificar si data es directamente un contrato (tiene id, template_id, etc.)
        const contractData = response.data as any;
        
        // Si no tiene id, puede ser que esté en otra estructura
        if (!contractData.id && typeof contractData === 'object') {
          // Intentar encontrar el contrato en otra propiedad
          if (contractData.contract) {
            return response as ContractResponseDto;
          }
          throw new Error('La respuesta del API no tiene la estructura esperada');
        }
        
        // Mapear el contrato desde la respuesta del API
        // Ahora todos los campos vienen directamente en el objeto, no en fields
        const contract: ContractDto = {
          id: contractData.id,
          template_id: contractData.template_id,
          sku: contractData.sku,
          code: contractData.code,
          access_token: contractData.access_token,
          status: contractData.status,
          html_snapshot: contractData.html_snapshot,
          pdf_path: contractData.pdf_path,
          related_type: contractData.related_type,
          related_id: contractData.related_id,
          signed_by_name: contractData.signed_by_name,
          signed_by_email: contractData.signed_by_email,
          signed_at: contractData.signed_at,
          email: contractData.email,
          signer_name: contractData.signer_name,
          identity_type: contractData.identity_type,
          identity_number: contractData.identity_number,
          company: contractData.company,
          signature: contractData.signature,
          // Información General
          general_info_first_name: contractData.general_info_first_name,
          general_info_last_name: contractData.general_info_last_name,
          general_info_nationality: contractData.general_info_nationality,
          general_info_document_type: contractData.general_info_document_type,
          general_info_document_number: contractData.general_info_document_number,
          general_info_email: contractData.general_info_email,
          general_info_phone: contractData.general_info_phone,
          general_info_address: contractData.general_info_address,
          general_info_address_additional: contractData.general_info_address_additional,
          general_info_address_city: contractData.general_info_address_city,
          general_info_address_state: contractData.general_info_address_state,
          general_info_address_zip_code: contractData.general_info_address_zip_code,
          general_info_address_country: contractData.general_info_address_country,
          general_info_birth_date: contractData.general_info_birth_date,
          general_info_certification_level: contractData.general_info_certification_level,
          general_info_dive_count: contractData.general_info_dive_count,
          general_info_how_did_you_know: contractData.general_info_how_did_you_know,
          general_info_accommodation: contractData.general_info_accommodation,
          general_info_activity: contractData.general_info_activity,
          general_info_activity_start_date: contractData.general_info_activity_start_date,
          general_info_height: contractData.general_info_height,
          general_info_weight: contractData.general_info_weight,
          general_info_shoe_size: contractData.general_info_shoe_size,
          general_info_special_requirements: contractData.general_info_special_requirements,
          // Contacto de Emergencia
          emergency_contact_first_name: contractData.emergency_contact_first_name,
          emergency_contact_last_name: contractData.emergency_contact_last_name,
          emergency_contact_phone: contractData.emergency_contact_phone,
          emergency_contact_email: contractData.emergency_contact_email,
          expires_at: contractData.expires_at,
          created_at: contractData.created_at,
          updated_at: contractData.updated_at,
          // Campos adicionales para compatibilidad
          company_id: contractData.company_id,
          pdf_url: contractData.pdf_url,
          signature_image: contractData.signature_image,
          public_token: contractData.public_token,
          fields: contractData.fields || {},
        };
        
        // Extraer campos adicionales del contrato para mostrar en la tabla de variables
        const fields: Array<{ key: string; value: string }> = [];
        
        // Función helper para agregar campos si tienen valor
        const addFieldIfExists = (key: string, value: any, label?: string) => {
          if (value !== null && value !== undefined && value !== '') {
            fields.push({ 
              key: label || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), 
              value: String(value) 
            });
          }
        };
        
        // Agregar campos básicos
        addFieldIfExists('email', contractData.email, 'Email');
        addFieldIfExists('signer_name', contractData.signer_name, 'Nombre del firmante');
        addFieldIfExists('identity_type', contractData.identity_type, 'Tipo de identidad');
        addFieldIfExists('identity_number', contractData.identity_number, 'Número de identidad');
        addFieldIfExists('company', contractData.company, 'Empresa');
        
        // Agregar campos de información general
        addFieldIfExists('general_info_first_name', contractData.general_info_first_name, 'Nombre');
        addFieldIfExists('general_info_last_name', contractData.general_info_last_name, 'Apellido');
        addFieldIfExists('general_info_email', contractData.general_info_email, 'Email (Info General)');
        addFieldIfExists('general_info_phone', contractData.general_info_phone, 'Teléfono');
        addFieldIfExists('general_info_address', contractData.general_info_address, 'Dirección');
        addFieldIfExists('general_info_document_number', contractData.general_info_document_number, 'Número de documento');
        
        // Agregar campos de contacto de emergencia
        addFieldIfExists('emergency_contact_first_name', contractData.emergency_contact_first_name, 'Contacto Emergencia - Nombre');
        addFieldIfExists('emergency_contact_last_name', contractData.emergency_contact_last_name, 'Contacto Emergencia - Apellido');
        addFieldIfExists('emergency_contact_phone', contractData.emergency_contact_phone, 'Contacto Emergencia - Teléfono');
        addFieldIfExists('emergency_contact_email', contractData.emergency_contact_email, 'Contacto Emergencia - Email');
        
        // Agregar campos del objeto fields si existen (para compatibilidad con versiones anteriores)
        if (contractData.fields && typeof contractData.fields === 'object') {
          Object.entries(contractData.fields).forEach(([key, value]) => {
            // Evitar duplicados
            const existingField = fields.find(f => f.key.toLowerCase() === key.toLowerCase());
            if (!existingField && value !== null && value !== undefined && value !== '') {
              fields.push({ 
                key: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), 
                value: String(value) 
              });
            }
          });
        }
        
        return {
          success: response.success,
          message: response.message,
          data: {
            contract,
            fields: fields.length > 0 ? fields : undefined,
          },
        };
      }
      
      // Si no tiene la estructura esperada, retornar error
      throw new Error('La respuesta del API no tiene la estructura esperada');
    } catch (error) {
      throw new Error(
        `Error en GetContractByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getContractByIdUseCase = new GetContractByIdUseCase();

