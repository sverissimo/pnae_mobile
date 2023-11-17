import { Repository } from "@domain/Repository";
import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
import { shouldSync } from "@services/system/systemUtils";
import { Usuario } from "@shared/types/Usuario";
import {
  UsuarioServiceConfig,
  usuarioDefaultConfig,
} from "./UsuarioServiceConfig";

export class UsuarioService {
  isConnected: boolean;
  localRepository: Repository<Usuario>;
  remoteRepository: UsuarioAPIRepository;

  constructor(
    usuarioServiceConfig: Partial<UsuarioServiceConfig> = usuarioDefaultConfig
  ) {
    const config = { ...usuarioDefaultConfig, ...usuarioServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
  }

  setConnectionStatus(value: boolean) {
    this.isConnected = value;
  }

  async getUsuariosByIds(ids: string[]) {
    const localUsuarios = await this.localRepository.findMany!(ids);
    if (!this.isConnected) {
      return localUsuarios;
    }

    const shouldSyncronize = await shouldSync(1000 * 60 * 60 * 24 * 5);

    const shouldNotFetchFromServer =
      (localUsuarios.length === ids.length &&
        localUsuarios.every((u) => !!u)) ||
      !shouldSyncronize;

    if (shouldNotFetchFromServer) {
      return localUsuarios;
    }
    const remoteUsuarios = await UsuarioAPIRepository.findMany({
      ids: ids.join(","),
    });

    for (const remoteUsuario of remoteUsuarios) {
      await this.saveLocal(remoteUsuario);
    }
    return remoteUsuarios;
  }

  private async saveLocal(usuario: Usuario) {
    await this.localRepository.create(usuario);
  }

  private async mergeLocalAndRemote(
    usuarios: Usuario[],
    remoteUsuarios: Usuario[]
  ): Promise<Usuario[]> {
    const remoteIdsSet = new Set(remoteUsuarios.map((u) => u.id_usuario));
    const usuarioIdsSet = new Set(usuarios.map((u) => u.id_usuario));

    const missingOnClient = remoteUsuarios.filter(
      (u) => !usuarioIdsSet.has(u.id_usuario)
    );
    const missingOnServer = usuarios.filter(
      (u) => !remoteIdsSet.has(u.id_usuario)
    );

    const merged = [
      ...new Map(
        [...missingOnServer, ...missingOnClient].map((u) => [u.id_usuario, u])
      ).values(),
    ];

    return merged;
  }
}
