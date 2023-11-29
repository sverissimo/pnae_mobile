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
    console.log(
      "🚀 - file: UsuarioService.ts:35 - UsuarioService - getUsuariosByIds - missingUsuariosOnLocal:",
      missingUsuariosOnLocal
    );

    if (!this.isConnected || !missingUsuariosOnLocal.length) {
      return localUsuarios;
    }

    const remoteUsuarios = await UsuarioAPIRepository.findMany({
      ids: ids.join(","),
    });

    console.log("### Fetched " + remoteUsuarios.length + " usuarios from API.");

    await this.saveManyLocal(remoteUsuarios);
    return remoteUsuarios;
  }

  async findMany({ matriculas }: { matriculas: string[] }) {
    if (!matriculas?.length) {
      return [];
    }

    const localUsuarios = (await this.localRepository.findAll!()).filter((u) =>
      matriculas?.includes(u.matricula_usuario)
    );

    const missingMatriculas = matriculas?.filter(
      (m) => !localUsuarios.find((u) => u.matricula_usuario === m)
    );

    if (!this.isConnected || !missingMatriculas?.length) {
      return localUsuarios;
    }

    const usuariosFromServer = await UsuarioAPIRepository.findMany({
      matricula: matriculas.join(","),
    });

    await this.saveManyLocal(usuariosFromServer);
    return [...localUsuarios, ...usuariosFromServer];
  }

  async findAll() {
    return await this.localRepository.findAll!();
  }

  private async saveManyLocal(usuarios: Usuario[]) {
    for (const usuario of usuarios) {
      console.log(
        "### Saving usuario locally" + usuario.id_usuario + " to local storage."
      );
      await this.localRepository.create(usuario);
    }
  }
}
