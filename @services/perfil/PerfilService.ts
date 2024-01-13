import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  PerfilServiceConfig,
  perfilDefaultConfig,
} from "./PerfilConfigService";
import { PerfilModel } from "@domain/perfil";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { SyncHelpers } from "@sync/SyncHelpers";

export class PerfilService {
  private isConnected: boolean;
  private localRepository: PerfilRepository;
  private remoteRepository: PerfilRepository;
  private syncHelpers: SyncHelpers;

  constructor(
    perfilServiceConfig: Partial<PerfilServiceConfig> = perfilDefaultConfig
  ) {
    const config = { ...perfilDefaultConfig, ...perfilServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
    this.syncHelpers = config.syncHelpers;
  }

  create = async (perfil: PerfilModel) => {
    try {
      if (!this.isConnected) {
        await this.localRepository.create(perfil);
        return;
      }

      await this.remoteRepository.create(perfil);
    } catch (error) {
      console.log("🚀 PerfilService.ts:33 - createPerfil - error:", error);
      throw error;
    }
  };

  getAllLocalPerfils = async () => {
    const allPerfils = await this.localRepository.findAll!();
    return allPerfils;
  };

  getPerfilOptions = async (): Promise<PerfilOptions | null> => {
    try {
      if (!this.isConnected) {
        const localPerfilOptions =
          await this.localRepository.getPerfilOptions();
        console.log("@@@ Getting perfilOptions from localRepository");

        return localPerfilOptions;
      }

      const perfilOptions = await this.remoteRepository.getPerfilOptions();
      perfilOptions &&
        (await this.localRepository.savePerfilOptions!(perfilOptions));

      console.log("### Fetching perfilOptions from remoteRepository");
      return perfilOptions;
    } catch (error) {
      console.log("🚀 PerfilService.ts:51 - getPerfilOptions - error:", error);
      throw error;
    }
  };

  getGruposProdutos = async () => {
    try {
      const localGruposProdutos =
        await this.localRepository.getGruposProdutos();

      if (!this.isConnected) {
        return localGruposProdutos;
      }

      const shouldUpdate = await this.syncHelpers.shouldSync(
        1000 * 60 * 60 * 24 * 5
      );

      if (!shouldUpdate && localGruposProdutos.grupos) {
        console.log("@@@ GruposProdutos stil valid, not running sync.");
        return localGruposProdutos;
      }

      const gruposProdutos = await this.remoteRepository.getGruposProdutos();

      gruposProdutos &&
        (await this.localRepository.saveGruposProdutos!(gruposProdutos));

      console.log("### Fetching gruposProdutos from remoteRepository");
      return gruposProdutos;
    } catch (error) {
      console.log("🚀 PerfilService.ts:51 - getPerfilOptions - error:", error);
      throw error;
    }
  };

  sync = async () => {
    const allPerfils = await this.localRepository.findAll!();
    if (allPerfils.length === 0) {
      return;
    }

    for (const perfil of allPerfils) {
      try {
        await this.remoteRepository.create(perfil);
        await this.localRepository.delete!(perfil.id);
      } catch (error) {
        console.log("🚀 PerfilService.ts:60 - sync - error:", error);
        throw error;
      }
    }
  };
}
