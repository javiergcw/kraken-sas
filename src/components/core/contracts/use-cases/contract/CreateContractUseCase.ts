import { contractService } from '../../services/ContractService';
import { ContractCreateRequestDto, ContractResponseDto } from '../../dto';

export class CreateContractUseCase {
  async execute(contractData: ContractCreateRequestDto): Promise<ContractResponseDto> {
    try {
      const response = await contractService.create(contractData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateContractUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createContractUseCase = new CreateContractUseCase();

