import { Repository } from "@domain/Repository";
import { UsuarioAPIRepository } from "@infrastructure/api";
import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";
import { Usuario } from "@shared/types";

export interface UsuarioServiceConfig {
  isConnected: boolean;
  localRepository: Repository<Usuario>;
  remoteRepository: UsuarioAPIRepository;
}

const localRepository = new UsuarioLocalStorageRepository();
const remoteRepository = new UsuarioAPIRepository();

export const usuarioDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
};
