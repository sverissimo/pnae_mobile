import { SystemLocalStorageRepository } from "@infrastructure/localStorage/system/SystemLocalStorageRepository";
import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";

import { SyncData } from "./types/SyncData";
import { CheckForUpdatesResponse } from "./types/CheckForUpdatesResponse";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { log } from "@shared/utils/log";
import { parseURI } from "@shared/utils/parseURI";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { RelatorioService } from "@services/relatorio/RelatorioService";
import { getLastSyncDate, shouldSync } from "./systemUtils";

export class SyncService {
  constructor(
    private systemLocalStorage = new SystemLocalStorageRepository(),
    private systemAPI = new SystemAPI(),
    private produtorService: ProdutorService = new ProdutorService({
      isConnected: true,
    }),
    private relatorioService: RelatorioService = new RelatorioService({
      isConnected: true,
    })
  ) {}

  async syncRelatorios(isConnected: boolean) {
    if (!isConnected) return;
    // await this.saveLastSyncDate();
    const lastSycDate = await getLastSyncDate();
    const shouldSyncronize = await shouldSync(1000 * 60 * 60);
    // console.log("🚀 - SyncService - syncRelatorios - date:", shouldSync);
    // return;

    const syncData = await this.getRelatoriosSyncInfo();
    log(syncData);

    const {
      missingOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
      upToDateIds,
    } = syncData;

    console.log("--------------Initiating sync service------------------");
    await this.relatorioService.createMany({
      missingOnClient,
      missingOnServer,
    });

    await this.relatorioService.updateMany({
      outdatedOnClient,
      outdatedOnServer,
    });
    console.log("--------------Sync service concluded------------------");
  }

  async getRelatoriosSyncInfo(): Promise<SyncData<RelatorioModel>> {
    const [produtorIds, relatoriosLocal] = await Promise.all([
      this.produtorService.getAllLocalProdutoresIds(),
      this.relatorioService.getLocalRelatorios(),
    ]);

    const relatoriosSyncRequest = relatoriosLocal.map((relatorio) => ({
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
    const response = await this.systemAPI.checkForUpdates({
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
