import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";
import { CheckForUpdatesResponse } from "../types/CheckForUpdatesResponse";
import { RelatorioModel } from "@features/relatorio/types";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { SyncHelpers } from "../SyncHelpers";

// ********** TODO **********
// ********** NEED TO BE IMPLEMENTED **********
export class ProdutorSyncService {
  constructor(
    private systemAPI = new SystemAPI(),
    private produtorService: ProdutorService = new ProdutorService({
      isConnected: true,
    })
  ) {}

  //* This method  assumes that the user is connected to the internet
  async syncProdutoresAndPerfis() {
    const shouldSyncronize = await new SyncHelpers().shouldSync(1000 * 60 * 60);
    if (!shouldSyncronize) return;
    console.log("🚀 - SyncService - syncRelatorios - date:", shouldSyncronize);
    const produtoresIds = await this.produtorService.getAllLocalProdutoresIds();
    const response = await this.systemAPI.checkForUpdates({
      produtorIds: produtoresIds,
    });
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
