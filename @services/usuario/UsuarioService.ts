import { Repository } from "@domain/Repository";
import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
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

    const missingUsuariosOnLocal = ids.filter(
      (id) => !localUsuarios.find((u) => u.id_usuario === id)
    );

    if (!this.isConnected || !missingUsuariosOnLocal.length) {
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
}
