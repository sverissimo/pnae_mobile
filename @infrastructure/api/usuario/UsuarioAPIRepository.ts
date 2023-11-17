import { Usuario } from "@shared/types/Usuario";
import { env } from "../../../config/env";
import { API } from "../API";
import { Repository } from "@domain/Repository";

export class UsuarioAPIRepository implements Partial<Repository<Usuario>> {
  private static readonly api = new API<Usuario>();
  private static readonly baseUrl: string = `${env.SERVER_URL}/usuario`;

  static async findMany(params: {
    ids?: string;
    matricula?: string;
  }): Promise<Usuario[]> {
    try {
      let { ids } = params;
      const { matricula } = params;
      //ids = ids || "1545" ; // dev/test purposes only
      //ids = ids || "1535"; // dev/test purposes only
      // ids = ids || "1620"; // dev/test purposes only
      // ids = ids || "2363"; // dev/test purposes only
      // matricula = matricula || "09860"; // dev/test purposes only

      if (!ids && !matricula) {
        ids = "1620";
        // throw new Error("You must provide either ids or matricula");
      }

      let url = this.baseUrl;
      if (ids) url += `/${ids}`;
      if (matricula) url += `?matricula=${matricula}`;

      const usuarios = await this.api.get(url);

      return Array.isArray(usuarios) ? usuarios : [usuarios];
    } catch (error) {
      console.error("Error fetching Usuarios:", error);
      throw error;
    }
  }
}
