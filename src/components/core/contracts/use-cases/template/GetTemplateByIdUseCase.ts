import { contractTemplateService } from '../../services/ContractTemplateService';
import { ContractTemplateResponseDto } from '../../dto';

export class GetTemplateByIdUseCase {
  async execute(id: string): Promise<ContractTemplateResponseDto> {
    try {
      const response = await contractTemplateService.getById(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetTemplateByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getTemplateByIdUseCase = new GetTemplateByIdUseCase();

