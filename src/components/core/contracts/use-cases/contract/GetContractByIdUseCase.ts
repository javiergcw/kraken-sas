import { contractService } from '../../services/ContractService';
import { ContractResponseDto, ContractDto } from '../../dto';

export class GetContractByIdUseCase {
  async execute(id: string): Promise<ContractResponseDto> {
    try {
      const response = await contractService.getById(id);
      
      // Si la respuesta ya tiene la estructura esperada, retornarla directamente
      if (response?.data?.contract) {
        return response;
      }
      
      // Si la respuesta tiene el contrato directamente en data, transformarla
      if (response?.success && response?.data && !response.data.contract) {
        const contractData = response.data as any;
        
        // Mapear el contrato desde la respuesta del API
        const contract: ContractDto = {
          id: contractData.id,
          company_id: contractData.company_id || '',
          template_id: contractData.template_id,
          sku: contractData.sku,
          code: contractData.code,
          related_type: contractData.related_type,
          related_id: contractData.related_id,
          status: contractData.status,
          // signer_name y signer_email son los valores originales del firmante
          signer_name: contractData.signer_name || contractData.signed_by_name || '',
          signer_email: contractData.signer_email || contractData.email || contractData.signed_by_email || '',
          fields: contractData.fields || {},
          // signed_by_name y signed_by_email son quién realmente firmó
          signed_by_name: contractData.signed_by_name,
          signed_by_email: contractData.signed_by_email || contractData.email,
          signed_at: contractData.signed_at,
          signature_image: contractData.signature_image,
          expires_at: contractData.expires_at,
          pdf_url: contractData.pdf_url,
          pdf_path: contractData.pdf_path,
          html_snapshot: contractData.html_snapshot,
          public_token: contractData.public_token,
          access_token: contractData.access_token,
          created_at: contractData.created_at,
          updated_at: contractData.updated_at,
        };
        
        // Extraer campos adicionales del contrato para mostrar en la tabla de variables
        const fields: Array<{ key: string; value: string }> = [];
        
        // Agregar campos adicionales que vienen en la respuesta del API pero no están en el DTO principal
        if (contractData.email) {
          fields.push({ key: 'Email', value: contractData.email });
        }
        if (contractData.identity_type) {
          fields.push({ key: 'Tipo de identidad', value: contractData.identity_type });
        }
        if (contractData.identity_number) {
          fields.push({ key: 'Número de identidad', value: contractData.identity_number });
        }
        if (contractData.company) {
          fields.push({ key: 'Empresa', value: contractData.company });
        }
        
        // Agregar campos del objeto fields si existen
        if (contractData.fields && typeof contractData.fields === 'object') {
          Object.entries(contractData.fields).forEach(([key, value]) => {
            // Evitar duplicados
            const existingField = fields.find(f => f.key.toLowerCase() === key.toLowerCase());
            if (!existingField) {
              fields.push({ 
                key: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), 
                value: String(value || '') 
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

