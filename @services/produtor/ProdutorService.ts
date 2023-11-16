import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { Produtor } from "@features/produtor/types/Produtor";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
// import { log } from "@shared/utils/log";
import {
  ProdutorServiceConfigInterface,
  produtorDefaultConfig,
} from "./ProdutorServiceConfig";
import { shouldSync } from "@services/system/systemUtils";

export class ProdutorService {
  private isConnected: boolean;
  private localRepository: ProdutorRepository;
  private remoteRepository: ProdutorRepository;

  constructor(
    produtorServiceConfig: Partial<ProdutorServiceConfigInterface> = produtorDefaultConfig
  ) {
    const config = { ...produtorDefaultConfig, ...produtorServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
  }

  getProdutor = async (CPFProdutor: string): Promise<Produtor | undefined> => {
    const produtorLocal = await this.localRepository
      .findByCPF(CPFProdutor)
      .catch((e: any) => console.log(e));

    const shouldSyncronize = await shouldSync(1000 * 60 * 60 * 24);

    console.log(
      "🚀 - *************************************************** shouldSync:",
      shouldSyncronize
    );
    if (produtorLocal && !shouldSyncronize) {
      console.log(
        "@@@ ProdutorService fetched from produtorLocal:",
        produtorLocal.nm_pessoa
      );
      return produtorLocal;
    }

    if (this.isConnected) {
      const produtor = await this.remoteRepository.findByCPF(CPFProdutor);
      produtor && (await this.saveProdutorLocal(produtor));
      return produtor;
    }
  };

  saveProdutorLocal = async (produtor: Produtor) => {
    if (!produtor?.id_pessoa_demeter) return;
    await this.localRepository.create(produtor);
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
