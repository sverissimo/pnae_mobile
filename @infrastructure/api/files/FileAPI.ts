import { env } from "@config/env";
export class FileAPI {
  static async downloadFileFromServer(id: string) {
    try {
      const url = env.SERVER_URL + `/files/${id}`;
      const token = env.ACCESS_TOKEN;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.log("🚀 ~ file: FileAPI.ts:23 ~ error:", error);
    }
  }
}
