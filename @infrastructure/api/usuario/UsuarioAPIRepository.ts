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

      if (!ids && !matricula) {
        throw new Error("É necessário informar matrícula e senha válidos.");
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

  static async login(params: {
    matricula_usuario: string;
    password: string;
  }): Promise<Usuario> {
    try {
      const { matricula_usuario, password } = params;
      if (!matricula_usuario || !password) {
        throw new Error("É necessário informar matrícula e senha válidos.");
      }

      const url = `${this.baseUrl}/login`;
      const result = (await this.api.post(url, {
        matricula_usuario,
        password,
      })) as string;

      if (!result) throw new Error("Erro ao fazer login.");

      const usuario = JSON.parse(result) as Usuario;
      return usuario as Usuario;
    } catch (error) {
      throw error;
    }
  }
}
