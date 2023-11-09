import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";
import { ProdutorService, RelatorioService } from "..";
import { RelatorioModel } from "@features/relatorio/types";
import { CheckForUpdatesResponse } from "./types/CheckForUpdatesResponse";
import { log } from "@shared/utils/log";
import { SyncData } from "./types/SyncData";
import { parseURI } from "@shared/utils";
import { RelatorioDomainService } from "@domain/relatorio/services";

export class SyncService {
  constructor(
    private produtorService: ProdutorService = new ProdutorService(),
    private relatorioService: RelatorioService = new RelatorioService(true),
    private systemAPI = new SystemAPI()
  ) {}

  async syncRelatorios() {
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
