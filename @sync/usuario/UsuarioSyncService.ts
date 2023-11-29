import { Repository } from "@domain/Repository";
import { Usuario } from "@shared/types";
import { SyncHelpers } from "../SyncHelpers";

import {
  UsuarioSyncConfig,
  usuarioSyncDefaultConfig,
} from "./UsuarioSyncConfig";
import { UsuarioAPIRepository } from "@infrastructure/api";

export class UsuarioSyncService {
  syncURL: string;
  usuarioLocalRepository: Repository<Usuario>;
  usuarioRemoteRepository: UsuarioAPIRepository;
  syncHelpers: SyncHelpers;

  constructor(usuarioSyncConfig?: Partial<UsuarioSyncConfig>) {
    const config = { ...usuarioSyncDefaultConfig, ...usuarioSyncConfig };
    this.syncURL = config.syncURL;
    this.usuarioLocalRepository = config.usuarioLocalRepository;
    this.usuarioRemoteRepository = config.usuarioRemoteRepository;
    this.syncHelpers = config.syncHelpers;
  }

  sync = async () => {
    const shouldUpdate = await this.syncHelpers.shouldSync(
      1000 * 60 * 60 * 24 * 7
    );

    if (!shouldUpdate) {
      console.log("@@@ Usuarios stil valid, not running sync.");
      return;
    }

    console.log(
      "🚀 - file: UsuarioSyncService.ts:36 - UsuarioSyncService - sync= - usuarioLocalRepository:",
      this.usuarioLocalRepository
    );
    const ids = (await this.usuarioLocalRepository.findAll!()).map(
      (usuario) => usuario.id_usuario
    );
    if (!ids.length) {
      return;
    }

    //@ts-ignore
    const updatedUsuarios = await this.usuarioRemoteRepository.findMany!(ids);
    await this.usuarioLocalRepository.createMany!(updatedUsuarios);
  };
}
