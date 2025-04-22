import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import {
  ProdutorServiceConfigInterface,
  produtorDefaultConfig,
} from "./ProdutorServiceConfig";
import { PerfilService } from "@services/perfil/PerfilService";

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

  getProdutor = async (
    CPFProdutor: string
  ): Promise<ProdutorModel | undefined> => {
    if (!this.isConnected) {
      const produtorLocal = await this.localRepository.findByCPF!(CPFProdutor);
      console.log("@@@ No connection, returning produtorLocal");
      return produtorLocal;
    }

    const produtor = await this.remoteRepository.findByCPF!(CPFProdutor);
    if (produtor) await this.localRepository.create(produtor);

    return produtor;
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
