import {
  PerfilServiceConfig,
  defaultPerfilConfig,
} from "./PerfilServiceConfig";
import { PerfilAPIRepository } from "@infrastructure/api/perfil/PerfilAPIRepository";
import { PerfilModel } from "@domain/perfil/PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";

//create class PerfilService, just like RelatorioService
export class PerfilService {
  private isConnected: boolean;
  private remoteRepository: PerfilAPIRepository;
  // private localRepository: PerfilRepository;
  // private syncService: PerfilSyncService;

  constructor(
    perfilServiceConfig: Partial<PerfilServiceConfig> = defaultPerfilConfig
  ) {
    const config = { ...defaultPerfilConfig, ...perfilServiceConfig };
    this.isConnected = config.isConnected;
    this.remoteRepository = config.remoteRepository;
    // this.localRepository = config.localRepository;
    // this.syncService = config.syncService;
  }

  createPerfil = async (input: PerfilModel): Promise<string> => {
    try {
      // const createdAt = new Date().toISOString();

      // const perfilModel = new Perfil(perfil).toModel();
      // await this.localRepository.create(perfilModel);
      console.log("### Saved resultLocal ok.");

      if (this.isConnected) {
        // await this.remoteRepository.create(perfilModel);
      }
      // return id;
      return "To be implemented...";
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  getPerfilOptions = async (): Promise<PerfilOptions> => {
    const perfilOptions = await this.remoteRepository.getPerfilOptions();
    return perfilOptions as PerfilOptions;
  };

  //   getPerfil = async (id: string): Promise<PerfilModel> => {};
  //   getPerfils = async (produtorId: string): Promise<PerfilModel[]> => {};
}
