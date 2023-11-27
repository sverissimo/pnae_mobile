import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorAPIRepository } from "@infrastructure/api/produtor/ProdutorAPIRepository";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { ProdutorSyncService } from "@sync/produtor/ProdutorSyncService";

export interface ProdutorServiceConfigInterface {
  isConnected: boolean;
  syncService: ProdutorSyncService;
  localRepository: ProdutorRepository;
  remoteRepository: ProdutorRepository;
}

const remoteRepository = new ProdutorAPIRepository();
const localRepository = new ProdutorLocalStorageRepository();
const syncService = new ProdutorSyncService();

export const produtorDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
  syncService,
};
