import { contractService } from '../../services/ContractService';
import { ContractsResponseDto } from '../../dto';

export class GetAllContractsUseCase {
  async execute(): Promise<ContractsResponseDto> {
    try {
      const response = await contractService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllContractsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllContractsUseCase = new GetAllContractsUseCase();

