import { ProdutorAPIRepository } from "../../@infrastructure/api/produtor/ProdutorAPIRepository";

const produtorAPIRepository = new ProdutorAPIRepository();
export class ProdutorService {
  constructor(private apiRepository: any = produtorAPIRepository) {
    this.apiRepository = apiRepository;
  }

  getProdutor = async (CPFProdutor: string) => {
    const produtor = await this.apiRepository.getProdutor(CPFProdutor);
    return produtor;
  };
}
