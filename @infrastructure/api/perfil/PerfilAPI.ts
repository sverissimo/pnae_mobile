import { env } from "@config/env";
import { API } from "../API";
import { Perfil } from "@features/perfil/types";

export class PerfilAPI extends API<Perfil> {
  private url = `${env.SERVER_URL}/perfil`;
  async getPerfilOptions() {
    const perfilOptions = await this.get(`${this.url}/options`);
    return perfilOptions;
  }
}
