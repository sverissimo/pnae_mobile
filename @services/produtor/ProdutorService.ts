import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorSyncService } from "@sync/produtor/ProdutorSyncService";
import {
  ProdutorServiceConfigInterface,
  produtorDefaultConfig,
} from "./ProdutorServiceConfig";
import { PerfilService } from "@services/perfil/PerfilService";

export class ProdutorService {
  private isConnected: boolean;
  private localRepository: ProdutorRepository;
  private remoteRepository: ProdutorRepository;
  private syncService: ProdutorSyncService;

  constructor(
    produtorServiceConfig: Partial<ProdutorServiceConfigInterface> = produtorDefaultConfig
  ) {
    const config = { ...produtorDefaultConfig, ...produtorServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
    this.syncService = config.syncService;
  }

  getProdutor = async (
    CPFProdutor: string
  ): Promise<ProdutorModel | undefined> => {
    const produtorLocal = await this.localRepository.findByCPF!(CPFProdutor);
    if (!this.isConnected) {
      console.log("@@@ No connection, returning produtorLocal");
      return produtorLocal;
    }
    const produtor = await this.remoteRepository.findByCPF!(CPFProdutor);
    produtor && (await this.localRepository.create(produtor));
    return produtor || produtorLocal;
  };

  getProdutorLocalPerfis = async (produtorId: string) => {
    const localPerfis = await new PerfilService().getPerfisByProdutorId(
      produtorId
    );
    return localPerfis;
  };

  getAllLocalProdutoresIds = async () => {
    const allProdutores = await this.localRepository.findAll!();
    const allProdutoresIds = allProdutores.map(
      (produtor: ProdutorModel) => produtor.id_pessoa_demeter
    );
    return allProdutoresIds;
  };
}
