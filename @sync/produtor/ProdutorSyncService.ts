import { CheckForUpdatesResponse } from "../types/CheckForUpdatesResponse";
import { SyncHelpers } from "../SyncHelpers";
import {
  ProdutorSyncConfig,
  produtorSyncDefaultConfig,
} from "./ProdutorSyncConfig";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { log } from "@shared/utils/log";

export class ProdutorSyncService {
  produtorLocalRepository: ProdutorRepository;
  produtorRemoteRepository: ProdutorRepository;
  syncURL: string;

  constructor(produtorSyncConfig?: ProdutorSyncConfig) {
    const config = { ...produtorSyncDefaultConfig, ...produtorSyncConfig };
    this.syncURL = config.syncURL;
    this.produtorLocalRepository = config.produtorLocalRepository;
    this.produtorRemoteRepository = config.produtorRemoteRepository;
  }

  async syncProdutorAndPerfis(produtorLocal: ProdutorModel) {
    const { id_pessoa_demeter: produtorId, dt_update_record: updatedAt } =
      produtorLocal;

    const syncInfo = await this.produtorRemoteRepository.getSyncInfo!(
      this.syncURL,
      { produtorId, updatedAt }
    );

    // log(syncInfo);

    return await this.handleSync(syncInfo, produtorLocal);
  }

  async syncAllProdutoresAndPerfis() {
    const shouldSyncronize = await new SyncHelpers().shouldSync(1000 * 60 * 60);
    if (!shouldSyncronize) return;

    const localProdutores = await this.produtorLocalRepository.findAll!();
    const produtoresIds = localProdutores.map(
      (produtor: ProdutorModel) => produtor.id_pessoa_demeter
    );
    const response = await this.produtorRemoteRepository.getSyncInfo!(
      this.syncURL,
      produtoresIds
    );
    console.log("🚀 - file: ProdutorSyncService.ts:67 - response:", response);
  }

  private async handleSync(
    syncInfo: CheckForUpdatesResponse<ProdutorModel>,
    produtorLocal: ProdutorModel
  ): Promise<ProdutorModel | void> {
    const {
      missingIdsOnServer,
      outdatedOnServer,
      missingOnClient,
      outdatedOnClient,
    } = syncInfo as CheckForUpdatesResponse<ProdutorModel>;

    if (missingOnClient?.length > 0) {
      await this.produtorLocalRepository.create(missingOnClient[0]);
      return missingOnClient[0];
    }
    if (outdatedOnClient?.length > 0) {
      await this.produtorLocalRepository.update(outdatedOnClient[0]);
      return outdatedOnClient[0];
    }

    if (missingIdsOnServer?.length > 0) {
      await this.produtorRemoteRepository.create(produtorLocal);
    }
    if (outdatedOnServer?.length > 0) {
      await this.produtorRemoteRepository.update(produtorLocal);
    }
  }
}
