import * as FileSystem from "expo-file-system";
import { env } from "../../config";

export const UsuarioAPI = {
  getUsuario: async (id: string) => {
    try {
      //id = id || "1545" ; // dev/test purposes only
      //id = id || "1535"; // dev/test purposes only
      id = id || "1620"; // dev/test purposes only
      const url = `${env.BASE_URL}/usuario/${id}`;
      const filePath =
        "file:///data/user/0/host.exp.exponent/cache/signature_1692315970277.png";
      const file = await FileSystem.getInfoAsync(filePath);
      console.log("🚀 ~ file: UsuarioAPI.ts:13 ~ getUsuario: ~ file:", file);

      const result = await fetch(url);

      const usuario = await result.json();
      return usuario;
    } catch (error) {
      void 0;
    }
  },
};
