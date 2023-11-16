import { Repository } from "@domain/Repository";
import { UsuarioAPI } from "@infrastructure/api/usuario/UsuarioAPI";
import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";
import { Usuario } from "@shared/types/Usuario";

export class UsuarioService {
  constructor(
    private isConnected: boolean,
    private localRepository: Repository<Usuario> = new UsuarioLocalStorageRepository()
  ) {}

  setConnectionStatus(value: boolean) {
    this.isConnected = value;
  }

  async getUsuariosByIds(ids: string[]) {
    if (!this.isConnected) {
      const localUsuarios = await this.localRepository.findMany!(ids);
      return localUsuarios;
    }

    const remoteUsuarios = await UsuarioAPI.getUsuarios({
      ids: ids.join(","),
    });
    // REFACTOR TO MULTI SET IN LOCALSTORAGE PARENT CLASS!!!
    for (const remoteUsuario of remoteUsuarios) {
      await this.saveLocal(remoteUsuario);
    }
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
