import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  PerfilServiceConfig,
  perfilDefaultConfig,
} from "./PerfilConfigService";
import { PerfilModel } from "@domain/perfil/PerfilModel";

export class PerfilService {
  private isConnected: boolean;
  private localRepository: PerfilRepository;
  private remoteRepository: PerfilRepository;

  constructor(
    perfilServiceConfig: Partial<PerfilServiceConfig> = perfilDefaultConfig
  ) {
    const config = { ...perfilDefaultConfig, ...perfilServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
  }

  create = async (perfil: PerfilModel) => {
    try {
      if (!this.isConnected) {
        await this.localRepository.create(perfil);
        return;
      }

      await this.remoteRepository.create(perfil);
    } catch (error) {
      console.log("🚀 PerfilService.ts:33 - createPerfil - error:", error);
      throw error;
    }
  };

  getAllLocalPerfils = async () => {
    const allPerfils = await this.localRepository.findAll!();
    return allPerfils;
  };

  getPerfilOptions = async () => {
    try {
      const perfilOptions = await this.remoteRepository.getPerfilOptions!();
      return perfilOptions;
    } catch (error) {
      console.log("🚀 PerfilService.ts:51 - getPerfilOptions - error:", error);
      throw error;
    }
  };

  sync = async () => {
    const allPerfils = await this.localRepository.findAll!();
    if (allPerfils.length === 0) {
      return;
    }

    for (const perfil of allPerfils) {
      try {
        await this.remoteRepository.create(perfil);
        await this.localRepository.delete!(perfil.id);
      } catch (error) {
        console.log("🚀 PerfilService.ts:60 - sync - error:", error);
        throw error;
      }
    }
  };
}
