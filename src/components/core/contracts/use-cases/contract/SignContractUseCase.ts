import { contractService } from '../../services/ContractService';
import { ContractSignRequestDto, ContractSignResponseDto } from '../../dto';

export class SignContractUseCase {
  async execute(id: string, signData: ContractSignRequestDto): Promise<ContractSignResponseDto> {
    try {
      const response = await contractService.sign(id, signData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en SignContractUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const signContractUseCase = new SignContractUseCase();

