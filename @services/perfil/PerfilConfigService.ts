import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilAPIRepository } from "@infrastructure/api/perfil/PerfilAPIRepository";
import { PerfilLocalStorageRepository } from "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository";

export interface PerfilServiceConfig {
  isConnected: boolean;
  localRepository: PerfilRepository;
  remoteRepository: PerfilRepository;
}

const remoteRepository = new PerfilAPIRepository();
const localRepository = new PerfilLocalStorageRepository();

export const perfilDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
};
