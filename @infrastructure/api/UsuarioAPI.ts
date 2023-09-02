import { env } from "../../config";
import { Usuario } from "@shared/types/Usuario";

export const UsuarioAPI = {
  getUsuario: async (id: string): Promise<Usuario | void> => {
    console.log("🚀 ~ file: UsuarioAPI.ts:6 ~ getUsuario: ~ id:", id);
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

  getUsuarioByMatricula: async (matricula: string): Promise<Usuario | void> => {
    try {
      const url = `${env.BASE_URL}/usuario?matricula=${matricula}`;
      const result = await fetch(url);
      const usuario = await result.json();
      return usuario;
    } catch (error) {
      console.log("🚀 ~ file: UsuarioAPI.ts:22 ~ getUsuario: ~ error:", error);
    }
  },
};
