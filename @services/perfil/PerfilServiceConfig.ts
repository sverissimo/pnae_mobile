//create default config file for perfil, just like relatorioConfig

import { PerfilAPIRepository } from "@infrastructure/api/perfil/PerfilAPIRepository";

export interface PerfilServiceConfig {
  isConnected: boolean;
  // localRepository: PerfilRepository;
  remoteRepository: PerfilAPIRepository;
  // syncService: PerfilSyncService;
}

const remoteRepository = new PerfilAPIRepository();
// const perfilDAO = new PerfilExpoSQLDAO(db);
// const perfilExpoSQLRepository = new PerfilSQLRepository(perfilDAO);
// const usuarioService = new UsuarioService();
// const syncService = new PerfilSyncService();

export const defaultPerfilConfig = {
  isConnected: false,
  remoteRepository,
  // localRepository: perfilExpoSQLRepository,
  // usuarioService,
  // syncService,
};
