import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  PerfilServiceConfig,
  perfilDefaultConfig,
} from "./PerfilConfigService";
import { PerfilModel } from "@domain/perfil";
import { SyncHelpers } from "@sync/SyncHelpers";
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
        await this.localRepository.create(perfil as PerfilModel);
        return;
      }
      const perfilDTO = new PerfilDataMapper(perfil).modelToRemoteDTO();

      await this.remoteRepository.create(perfilDTO);
    } catch (error) {
      console.log("🚀 PerfilService.ts:33 - createPerfil - error:", error);
      throw error;
    }
  };

  getPerfisByProdutorId = async (produtorId: string) => {
    const allPerfis = await this.localRepository.findAll!();
    const perfis = allPerfis.filter(
      (perfil) => perfil.id_cliente === produtorId
    );

    return perfis;
  };

  getAllLocalPerfils = async () => {
    const allPerfils = await this.localRepository.findAll!();
    return allPerfils;
  };

  getPerfilOptions = async () => {
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

      if (perfilOptions) {
        await this.localRepository.savePerfilOptions!(perfilOptions);
      }

      console.log("### Fetching perfilOptions from remoteRepository");
      return perfilOptions;
    } catch (error) {
      console.log("🚀 PerfilService.ts:51 - getPerfilOptions - error:", error);
      throw error;
    }
  };

  /* @description Always get from localGruposProdutos if ever saved LOCALLY */
  getGruposProdutos = async () => {
    try {
      const localGruposProdutos =
        await this.localRepository.getGruposProdutos();

      if (!this.isConnected) {
        return localGruposProdutos;
      }

      if (localGruposProdutos?.grupos) {
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

  getContractInfo = async () => {
    try {
      const localContractInfo = await this.localRepository.getContractInfo();
      if (!this.isConnected) {
        return localContractInfo;
      }

      const contractInfo = await this.remoteRepository.getContractInfo();
      if (contractInfo) {
        await this.localRepository.saveContractInfo!(contractInfo);
      }

      console.log("### Fetching contractInfo from remoteRepository");
      return contractInfo;
    } catch (error) {
      console.log("🚀 PerfilService.ts:51 - getPerfilOptions - error:", error);
      throw error;
    }
  };

  //Only syncs if there are local perfils saved offline to sync
  sync = async () => {
    if (!this.isConnected) return;
    const allPerfilsWithLocalIds = await this.localRepository
      .findAllWithLocalIds!();

    if (allPerfilsWithLocalIds.length === 0) {
      console.log("@@@ No localPerfis to sync");
      return;
    }

    await Promise.all([this.getContractInfo(), this.getGruposProdutos()]);

    const perfilOptions = await this.getPerfilOptions();
    if (!perfilOptions) return;

    for (const perfilWithoutLocalId of allPerfilsWithLocalIds) {
      try {
        const { localId, ...perfil } = perfilWithoutLocalId;

        const perfilDTO = new PerfilDataMapper(perfil).modelToRemoteDTO();

        await this.remoteRepository.create(perfilDTO);
        await this.localRepository.delete!(localId);

        console.log("### Local perfil synced with remoteRepository");
      } catch (error) {
        console.log("🚀 PerfilService.ts:60 - sync - error:", error);
        throw error;
      }
    }
  };
}
