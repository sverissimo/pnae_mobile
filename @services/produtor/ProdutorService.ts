import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorAPIRepository } from "../../@infrastructure/api/produtor/ProdutorAPIRepository";
import { log } from "@shared/utils/log";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { Produtor } from "@features/produtor/types/Produtor";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";

const produtorAPIRepository = new ProdutorAPIRepository();

export class ProdutorService {
  constructor(
    private isConnected: boolean,
    private localStorageRepository: ProdutorRepository = new ProdutorLocalStorageRepository(),
    private apiRepository: ProdutorRepository = produtorAPIRepository
  ) {}

  getProdutor = async (CPFProdutor: string): Promise<Produtor | undefined> => {
    const produtorLocal = await this.localStorageRepository
      .findByCPF(CPFProdutor)
      .catch((e: any) => console.log(e));

    if (produtorLocal) {
      console.log(
        "@@@ ProdutorService fetched from produtorLocal:",
        produtorLocal.nm_pessoa
      );
      return produtorLocal;
    }

    if (this.isConnected) {
      const produtor = await this.apiRepository.findByCPF(CPFProdutor);
      produtor && (await this.localStorageRepository.create(produtor));
      return produtor;
    }
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
