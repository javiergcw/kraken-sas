import { contractService } from '../../services/ContractService';
import { ContractResponseDto } from '../../dto';

export class GetContractByIdUseCase {
  async execute(id: string): Promise<ContractResponseDto> {
    try {
      const response = await contractService.getById(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetContractByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getContractByIdUseCase = new GetContractByIdUseCase();

