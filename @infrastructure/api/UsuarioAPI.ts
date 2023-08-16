import { env } from "../../config";

export const UsuarioAPI = {
  getUsuario: async (id: string) => {
    try {
      //id = id || "1545" ; // dev/test purposes only
      //id = id || "1535"; // dev/test purposes only
      id = id || "1620"; // dev/test purposes only
      const url = `${env.BASE_URL}/usuario/${id}`;

      const result = await fetch(url);

      const usuario = await result.json();
      console.log("🚀 ~ file: UsuarioAPI.ts:12 ~ fkkkkkkkk usuario:", usuario);
      return usuario;
    } catch (error) {
      void 0;
    }
  },
};
