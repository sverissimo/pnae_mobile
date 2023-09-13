import { Usuario } from "@shared/types/Usuario";

import { env } from "../../config";

export const UsuarioAPI = {
  getUsuario: async (id: string): Promise<Usuario | void> => {
    try {
      //id = id || "1545" ; // dev/test purposes only
      //id = id || "1535"; // dev/test purposes only
      id = id || "1620"; // dev/test purposes only

      const url = `${env.BASE_URL}/usuario/${id}`;
      const result = await fetch(url);
      const usuario = await result.json();
      return usuario;
    } catch (error) {
      console.log("🚀 ~ file: UsuarioAPI.ts:22 ~ getUsuario: ~ error:", error);
    }
  },

  getUsuariosByMatricula: async (matricula: string): Promise<Usuario[]> => {
    console.log(
      "🚀 ~ file: UsuarioAPI.ts:22 ~ getUsuariosByMatricula: ~ matricula:",
      matricula
    );
    try {
      const url = `${env.BASE_URL}/usuario?matricula=${matricula}`;
      const result = await fetch(url);
      let usuarios = await result.json();
      if (!Array.isArray(usuarios)) usuarios = [usuarios];
      return usuarios;
    } catch (error) {
      console.log("🚀 ~ file: UsuarioAPI.ts:22 ~ getUsuario: ~ error:", error);
    }
    return [];
  },

  getUsuarios: async (ids: string[]): Promise<Usuario[]> => {
    try {
      const url = `${env.BASE_URL}/usuario/${ids.join(",")}`;
      const result = await fetch(url);

      let usuarios = await result.json();
      if (!Array.isArray(usuarios)) usuarios = [usuarios];

      return usuarios;
    } catch (error: any) {
      console.error("🚀 ~ file: UsuarioAPI.ts:39 :", error);
      throw new Error(error?.message || "Erro ao buscar usuários.");
    }
  },
};
