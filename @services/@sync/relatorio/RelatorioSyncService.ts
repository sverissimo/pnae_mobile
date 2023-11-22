import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { RelatorioService } from "@services/relatorio/RelatorioService";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { SyncData } from "../types/SyncData";
import { CheckForUpdatesResponse } from "../types/CheckForUpdatesResponse";
import { RelatorioModel } from "@features/relatorio/types";
import { parseURI } from "@shared/utils/parseURI";
import { log } from "@shared/utils/log";
import {
  RelatorioSyncConfig,
  defaultRelatorioSyncConfig,
} from "./RelatorioSyncConfig";

export class RelatorioSyncService {
  private api: SystemAPI;
  private produtorService: ProdutorService;
  private relatorioService: RelatorioService;

  constructor(
    relatorioSyncConfig: RelatorioSyncConfig = defaultRelatorioSyncConfig
  ) {
    const config = { ...defaultRelatorioSyncConfig, ...relatorioSyncConfig };
    this.api = config.api;
    this.produtorService = config.produtorService;
    this.relatorioService = config.relatorioService;
  }

  async syncRelatorios(isConnected: boolean, produtorId?: string) {
    if (!isConnected) return;
    // await this.saveLastSyncDate();

    const syncData = await this.getRelatoriosSyncInfo(produtorId);
    // log(syncData);

    const {
      missingOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
      upToDateIds,
    } = syncData;

    await this.relatorioService.createMany({
      missingOnClient,
      missingOnServer,
    });

    await this.relatorioService.updateMany({
      outdatedOnClient,
      outdatedOnServer,
    });
  }

  /**Se não for passado o produtorId, atualiza todos os produtores */
  async getRelatoriosSyncInfo(
    produtorId?: string
  ): Promise<SyncData<RelatorioModel>> {
    const produtorIds = (
      produtorId
        ? [produtorId]
        : await this.produtorService.getAllLocalProdutoresIds()
    ).slice(0, 30);

    const relatoriosLocal = await this.relatorioService.getLocalRelatorios();

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
    const response = await this.api.checkForUpdates({
      produtorIds,
      relatoriosSyncInfo,
    });
    if (!response) {
      console.log("🚀 - SyncService - response:", response);
      throw new Error("*** Failed to get check for updates response");
    }
    return response as CheckForUpdatesResponse<RelatorioModel>;
  }
}
