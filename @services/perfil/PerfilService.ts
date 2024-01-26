import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  PerfilServiceConfig,
  perfilDefaultConfig,
} from "./PerfilConfigService";
import { PerfilModel } from "@domain/perfil";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { SyncHelpers } from "@sync/SyncHelpers";
import createPerfilInput from "_mockData/perfil/createPerfilInput2.json";
import { PerfilViewModel } from "@services/perfil/dto/PerfilViewModel";
import { PerfilDataMapper } from "@services/perfil/mapper/PerfilDataMapper";

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
      const perfilOptions = await this.getPerfilOptions();
      if (!perfilOptions) throw new Error("PerfilOptions not found");

      if (!this.isConnected) {
        await this.localRepository.create(perfil);
        return;
      }
      const perfilDTO = new PerfilDataMapper(
        perfil,
        perfilOptions
      ).toRemoteDTO();
      await this.remoteRepository.create(perfilDTO);
    } catch (error) {
      console.log("🚀 PerfilService.ts:33 - createPerfil - error:", error);
      throw error;
    }
  };

  perfilInputToModel = async (perfil: any) => {
    const perfilOptions = await this.getPerfilOptions();
    const perfilDataMapper = new PerfilDataMapper(perfil, perfilOptions);
    if (
      !perfil.dados_producao_in_natura &&
      !perfil.dados_producao_agro_industria
    ) {
      const perfilModel = perfilDataMapper.toModel();
      return perfilModel;
    }

    const perfilViewModel = perfilDataMapper.toViewModel() as PerfilViewModel;
    return perfilViewModel;
  };

  getAllLocalPerfils = async () => {
    const allPerfils = await this.localRepository.findAll!();
    return allPerfils;
  };

  getPerfilOptions = async (): Promise<PerfilOptions> => {
    try {
      const localPerfilOptions = await this.localRepository.getPerfilOptions();

      if (!this.isConnected) {
        return localPerfilOptions;
      }

      const shouldUpdate = await this.syncHelpers.shouldSync(
        1000 * 60 * 60 * 24 * 5
      );
      if (!shouldUpdate && localPerfilOptions) {
        console.log("@@@ PerfilOptions stil valid, not running sync.");
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

    const perfilOptions = await this.getPerfilOptions();
    for (const perfil of allPerfils) {
      try {
        const perfilDTO = new PerfilDataMapper(
          perfil,
          perfilOptions
        ).toRemoteDTO();
        await this.remoteRepository.create(perfilDTO);
        await this.localRepository.delete!(perfil.id);
      } catch (error) {
        console.log("🚀 PerfilService.ts:60 - sync - error:", error);
        throw error;
      }
    }
  };
}
