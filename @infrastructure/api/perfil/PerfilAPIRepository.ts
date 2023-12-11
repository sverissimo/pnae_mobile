import { env } from "@config/env";
import { API } from "../API";
import { Perfil } from "@features/perfil/types";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";

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
    return perfilOptions;
  }
}
