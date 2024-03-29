import { env } from "@config/env";
import { API } from "../API";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { GruposProdutosOptions, PerfilModel } from "@domain/perfil";
import { PerfilOptions } from "./PerfilOptions";
import { Perfil } from "@domain/perfil/Perfil";
import { PerfilDTO } from "./PerfilDTO";
import { ContractInfo } from "@domain/perfil/ContractInfo";

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

  async getContractInfo() {
    const contractInfo = (await this.get(
      `${this.url}/contractInfo`
    )) as unknown;
    return contractInfo as ContractInfo[];
  }
}
