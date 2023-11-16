import { Usuario } from "@shared/types/Usuario";
import { env } from "../../../config/env";

export const UsuarioAPI = {
  getUsuarios: async (params: {
    ids?: string;
    matricula?: string;
  }): Promise<Usuario[]> => {
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

      let url = `${env.SERVER_URL}/usuario`;
      if (ids) url += `/${ids}`;
      if (matricula) url += `?matricula=${matricula}`;

      console.log("🚀------------------------------------- - url:", url);

      const result = await fetch(url);
      const usuarios = await result.json();
      if (result.status === 404) {
        return [];
      }

      return Array.isArray(usuarios) ? usuarios : [usuarios];
    } catch (error) {
      console.error("🚀 ~ file: UsuarioAPI.ts:39:", error);
      throw error;
    }
  },
};
