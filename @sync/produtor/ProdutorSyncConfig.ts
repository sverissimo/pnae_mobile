import { env } from "@config/env";
import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorAPIRepository } from "@infrastructure/api";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";

export interface ProdutorSyncConfig {
  syncURL: string;
  produtorLocalRepository: ProdutorRepository;
  produtorRemoteRepository: ProdutorRepository;
}

const syncURL = `${env.SERVER_URL}/sync/produtor`;
const produtorLocalRepository = new ProdutorLocalStorageRepository();
const produtorRemoteRepository = new ProdutorAPIRepository();

export const produtorSyncDefaultConfig = {
  syncURL,
  produtorLocalRepository,
  produtorRemoteRepository,
};
