import { RelatorioRepository } from "@domain/relatorio";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { RelatorioModel } from "@features/relatorio/types";
import { SyncData } from "../types/SyncData";
import { CheckForUpdatesResponse } from "../types/CheckForUpdatesResponse";
import { parseURI } from "@shared/utils/parseURI";
import { log } from "@shared/utils/log";
import {
  RelatorioSyncConfig,
  defaultRelatorioSyncConfig,
} from "./RelatorioSyncConfig";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";

export class RelatorioSyncService {
  private syncURL: string;
  private produtorLocalRepository: ProdutorRepository;
  private relatorioLocalRepository: RelatorioRepository;
  private relatorioRemoteRepository: RelatorioRepository;

  constructor(
    relatorioSyncConfig: RelatorioSyncConfig = defaultRelatorioSyncConfig
  ) {
    const config = { ...defaultRelatorioSyncConfig, ...relatorioSyncConfig };
    this.syncURL = config.syncURL;
    this.produtorLocalRepository = config.produtorLocalRepository;
    this.relatorioLocalRepository = config.relatorioLocalRepository;
    this.relatorioRemoteRepository = config.relatorioRemoteRepository;
  }

  async syncRelatorios(produtorId?: string) {
    const syncData = await this.getRelatoriosSyncInfo(produtorId);
    log(syncData);

    const {
      missingOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
      upToDateIds,
    } = syncData;

    if (missingOnClient?.length > 0) {
      await this.relatorioLocalRepository.createMany(missingOnClient);
    }
    if (outdatedOnClient?.length > 0) {
      await this.relatorioLocalRepository.updateMany(outdatedOnClient);
    }
    if (missingOnServer?.length > 0) {
      await this.relatorioRemoteRepository.createMany(missingOnServer);
    }
    if (outdatedOnServer?.length > 0) {
      await this.relatorioRemoteRepository.updateMany(outdatedOnServer);
    }
  }

  /**Se não for passado o produtorId, atualiza todos os produtores */
  async getRelatoriosSyncInfo(
    produtorId?: string
  ): Promise<SyncData<RelatorioModel>> {
    const produtorIds = produtorId
      ? [produtorId]
      : await this.produtorLocalRepository.getAllProdutoresIds!();

    const relatoriosLocal = await this.relatorioLocalRepository.findAll();

    const relatoriosSyncRequest = relatoriosLocal
      .filter((relatorio) => produtorIds.includes(relatorio.produtorId))
      .map((relatorio) => ({
        id: relatorio.id,
        assinaturaURI: parseURI(relatorio.assinaturaURI),
        pictureURI: parseURI(relatorio.pictureURI),
        updatedAt: relatorio.updatedAt,
      }));

    const syncInfo = await this.getCheckForUpdatesResponse(
      produtorIds,
      relatoriosSyncRequest
    );
    const { missingIdsOnServer, outdatedOnServer, ...rest } = syncInfo;

    const toCreateOnServer = relatoriosLocal.filter((r) =>
      missingIdsOnServer.includes(r.id)
    );

    const toUpdateOnServer = RelatorioDomainService.getDataToUpdateOnServer(
      relatoriosLocal,
      outdatedOnServer
    );

    return {
      ...rest,
      missingOnServer: toCreateOnServer,
      outdatedOnServer: toUpdateOnServer,
    };
  }

  private async getCheckForUpdatesResponse(
    produtorIds: string[],
    relatoriosSyncInfo: any
  ): Promise<CheckForUpdatesResponse<RelatorioModel>> {
    const response = await this.relatorioRemoteRepository.getSyncInfo!(
      this.syncURL,
      {
        produtorIds,
        relatoriosSyncInfo,
      }
    );
    if (!response) {
      console.log("🚀 - SyncService - response:", response);
      throw new Error("*** Failed to get check for updates response");
    }
    return response as CheckForUpdatesResponse<RelatorioModel>;
  }
}
