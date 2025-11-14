import { contractTemplateService } from '../../services/ContractTemplateService';
import { ContractTemplateDeleteResponseDto } from '../../dto';

export class DeleteTemplateUseCase {
  async execute(id: string): Promise<ContractTemplateDeleteResponseDto> {
    try {
      const response = await contractTemplateService.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteTemplateUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const deleteTemplateUseCase = new DeleteTemplateUseCase();

