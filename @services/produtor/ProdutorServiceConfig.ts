import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { ProdutorAPIRepository } from "@infrastructure/api/produtor/ProdutorAPIRepository";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
export interface ProdutorServiceConfigInterface {
  isConnected: boolean;
  localRepository: ProdutorRepository;
  remoteRepository: ProdutorRepository;
}

const remoteRepository = new ProdutorAPIRepository();
const localRepository = new ProdutorLocalStorageRepository();

export const produtorDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
};
