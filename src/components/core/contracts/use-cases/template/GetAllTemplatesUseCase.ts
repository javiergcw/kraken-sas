import { contractTemplateService } from '../../services/ContractTemplateService';
import { ContractTemplatesResponseDto } from '../../dto';

export class GetAllTemplatesUseCase {
  async execute(): Promise<ContractTemplatesResponseDto> {
    try {
      const response = await contractTemplateService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllTemplatesUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllTemplatesUseCase = new GetAllTemplatesUseCase();

