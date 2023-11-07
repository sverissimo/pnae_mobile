import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";
import { ProdutorService, RelatorioService } from "..";

import { RelatorioModel } from "@features/relatorio/types";
import { CheckForUpdatesResult } from "./types/CheckForUpdatesResult";
import { CheckForUpdatesData } from "./types/CheckForUpdatesData";

export class SyncService {
  constructor(
    private produtorService: ProdutorService = new ProdutorService(),
    private relatorioService: RelatorioService = new RelatorioService(true),
    private systemAPI = new SystemAPI()
  ) {}

  async syncRelatorios() {
    const {
      missingOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
    } = await this.getRelatoriosSyncInfo();

    console.info({
      missingOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
    });
    const createResult = await this.relatorioService.createMany({
      missingOnClient,
      missingOnServer,
    });

    // const updateResult = await this.relatorioService.updateMany({
    //   outdatedOnClient,
    //   outdatedOnServer,
    // });
  }

  async getRelatoriosSyncInfo(): Promise<CheckForUpdatesData<RelatorioModel>> {
    const produtorIds = await this.produtorService.getAllLocalProdutoresIds();

    const relatoriosLocal = await this.relatorioService.getLocalRelatorios();

    const relatoriosSyncInfo = relatoriosLocal.map((relatorio) => ({
      id: relatorio.id,
      updatedAt: relatorio.updatedAt,
    }));

    const syncInfo = (await this.systemAPI.checkForUpdates({
      produtorIds,
      relatoriosSyncInfo,
    })) as CheckForUpdatesResult<RelatorioModel>;
    const { missingIdsOnServer, outdatedIdsOnServer, ...rest } = syncInfo;
    console.log("🚀 - SyncService - getRelatoriosSyncInfo - rest:", rest);

    const missingOnServer = relatoriosLocal.filter((r) =>
      missingIdsOnServer?.includes(r.id)
    );
    const outdatedOnServer = relatoriosLocal.filter((r) =>
      outdatedIdsOnServer?.includes(r.id)
    );

    const syncData = {
      ...rest,
      missingOnServer,
      outdatedOnServer,
    };

    return syncData;
  }
}
