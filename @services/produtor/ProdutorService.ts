import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorAPIRepository } from "../../@infrastructure/api/produtor/ProdutorAPIRepository";
import { log } from "@shared/utils/log";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";

const produtorAPIRepository = new ProdutorAPIRepository();

export class ProdutorService {
  constructor(
    private apiRepository: any = produtorAPIRepository,
    private localStorageRepository: any = new ProdutorLocalStorageRepository()
  ) {
    this.apiRepository = apiRepository;
  }

  getProdutor = async (CPFProdutor: string) => {
    const produtorLocal = await new ProdutorLocalStorageRepository()
      .findByCPF(CPFProdutor)
      .catch((e: any) => console.log(e));

    if (produtorLocal) {
      console.log(
        "@@@ ProdutorService fetched from produtorLocal:",
        produtorLocal.nm_pessoa
      );
      return produtorLocal;
    }
    const produtor = await this.apiRepository.getProdutor(CPFProdutor);
    await this.localStorageRepository.create(produtor);
    return produtor;
  };

  getAllLocalProdutoresIds = async () => {
    const allProdutores =
      await new ProdutorLocalStorageRepository().getAllCollectionData();
    const allProdutoresIds = allProdutores.map(
      (produtor: ProdutorModel) => produtor.id_pessoa_demeter
    );
    return allProdutoresIds;
  };
}
