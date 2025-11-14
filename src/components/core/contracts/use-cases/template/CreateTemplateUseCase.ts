import { contractTemplateService } from '../../services/ContractTemplateService';
import { ContractTemplateCreateRequestDto, ContractTemplateResponseDto } from '../../dto';

export class CreateTemplateUseCase {
  async execute(templateData: ContractTemplateCreateRequestDto): Promise<ContractTemplateResponseDto> {
    try {
      const response = await contractTemplateService.create(templateData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateTemplateUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createTemplateUseCase = new CreateTemplateUseCase();

