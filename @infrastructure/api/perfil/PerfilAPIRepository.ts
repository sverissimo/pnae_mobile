import { env } from "@config/env";
import { API } from "../API";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { GruposProdutosOptions, PerfilModel } from "@domain/perfil";
import { PerfilOptions } from "./PerfilOptions";
import { Perfil } from "@domain/perfil/Perfil";
import { PerfilDataMapper } from "./PerfilDataMapper";
import { log } from "@shared/utils/log";

export class PerfilAPIRepository
  extends API<Perfil>
  implements PerfilRepository
{
  private url = `${env.SERVER_URL}/perfil`;

  async create(perfil: PerfilModel, perfilOptions: PerfilOptions) {
    const dataMapper = new PerfilDataMapper(perfilOptions as PerfilOptions);
    const perfilDTO = dataMapper.toDTO(perfil);

    log(perfilDTO);
    await this.post(`${this.url}`, perfilDTO);
    // return perfilDT;
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
