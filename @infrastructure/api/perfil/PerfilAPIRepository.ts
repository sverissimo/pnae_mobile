import { env } from "@config/env";
import { API } from "../API";
import { Perfil } from "@features/perfil/types";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { PerfilOptions } from "./PerfilOptions";
import { PerfilOptionsDTO } from "./PerfilOptionsDTO";
import { PerfilModel } from "@domain/perfil";

export class PerfilAPIRepository
  extends API<Perfil>
  implements PerfilRepository
{
  private url = `${env.SERVER_URL}/perfil`;

  async create(perfil: Perfil) {
    await this.post<Perfil>(`${this.url}/`, perfil);
  }

  async getPerfilOptions() {
    const perfilOptions = await this.get(`${this.url}/options`);
    return perfilOptions as any;
  }

  private toPerfilDTO = (
    perfilOptionsDTO: PerfilOptionsDTO,
    perfil: PerfilModel
  ) => {
    const perfilOptions = perfilOptionsDTO.reduce((prev, curr) => {
      const { tipo, descricao, id } = curr;
      if (!prev[tipo]) {
        prev[tipo] = [descricao];
      } else {
        prev[tipo].push(descricao);
      }
      return prev;
    }, {} as any);
    return perfilOptions;
  };
}
