import { env } from "@config/env";
import { API } from "../API";

export class PerfilAPIRepository {
  private api = new API();
  private url = `${env.SERVER_URL}/perfil`;

  async getPerfilOptions() {
    const perfilOptions = await this.api.get(`${this.url}/options`);
    return perfilOptions;
  }
}
