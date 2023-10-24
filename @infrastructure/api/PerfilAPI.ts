import { env } from "@config/env";
import { API } from "./API";

export class PerfilAPI extends API {
  private url = `${env.SERVER_URL}/perfil`;
  async getPerfilOptions() {
    const perfilOptions = await this.get(`${this.url}/options`);
    return perfilOptions;
  }
}
