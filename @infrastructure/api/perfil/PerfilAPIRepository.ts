import { env } from "@config/env";
import { API } from "../API";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { GruposProdutosOptions, PerfilModel } from "@domain/perfil";
import { PerfilOptions } from "./PerfilOptions";
import { Perfil } from "@domain/perfil/Perfil";
import { log } from "@shared/utils/log";
import { PerfilDataMapper } from "@services/perfil/mapper/PerfilDataMapper";
import { PerfilDTO } from "./PerfilDTO";

export class PerfilAPIRepository
  extends API<Perfil>
  implements PerfilRepository
{
  private url = `${env.SERVER_URL}/perfil`;

  async create(perfil: PerfilDTO) {
    await this.post(`${this.url}`, perfil);
  }

  async getPerfilOptions() {
    const perfilOptions = (await this.get(`${this.url}/options`)) as unknown;
    return perfilOptions as PerfilOptions;
  }

  async getGruposProdutos() {
    const gruposProdutos = (await this.get(`${this.url}/produtos`)) as unknown;
    return gruposProdutos as GruposProdutosOptions;
  }
}
