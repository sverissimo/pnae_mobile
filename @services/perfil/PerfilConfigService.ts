import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilAPIRepository } from "@infrastructure/api/perfil/PerfilAPIRepository";
import { PerfilLocalStorageRepository } from "@infrastructure/localStorage/perfil/PerfilLocalStorageRepository";
import { SyncHelpers } from "@sync/SyncHelpers";

export interface PerfilServiceConfig {
  isConnected: boolean;
  localRepository: PerfilRepository;
  remoteRepository: PerfilRepository;
  syncHelpers: SyncHelpers;
}

const remoteRepository = new PerfilAPIRepository();
const localRepository = new PerfilLocalStorageRepository();
const syncHelpers = new SyncHelpers();

export const perfilDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
  syncHelpers,
};
