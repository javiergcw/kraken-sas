import { contractTemplateService } from '../../services/ContractTemplateService';
import { ContractTemplateUpdateRequestDto, ContractTemplateResponseDto } from '../../dto';

export class UpdateTemplateUseCase {
  async execute(id: string, templateData: ContractTemplateUpdateRequestDto): Promise<ContractTemplateResponseDto> {
    try {
      const response = await contractTemplateService.update(id, templateData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateTemplateUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateTemplateUseCase = new UpdateTemplateUseCase();

