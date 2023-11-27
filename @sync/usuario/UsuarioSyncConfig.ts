//UsuarioSyncConfig.ts

import { Repository } from "@domain/Repository";
import { UsuarioAPIRepository } from "@infrastructure/api";
import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";
import { Usuario } from "@shared/types";
import { SyncHelpers } from "../SyncHelpers";

export interface UsuarioSyncConfig {
  syncURL: string;
  usuarioLocalRepository: Repository<Usuario>;
  usuarioRemoteRepository: UsuarioAPIRepository;
  syncHelpers: SyncHelpers;
}

const syncURL = `${process.env.SERVER_URL}/sync/usuario`;
const usuarioLocalRepository = new UsuarioLocalStorageRepository();
const usuarioRemoteRepository = UsuarioAPIRepository;
const syncHelpers = new SyncHelpers();

export const usuarioSyncDefaultConfig: UsuarioSyncConfig = {
  syncURL,
  syncHelpers,
  usuarioLocalRepository,
  usuarioRemoteRepository,
};
