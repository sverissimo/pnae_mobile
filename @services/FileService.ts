import * as FileSystem from "expo-file-system";
import { env } from "@config/env";
import { RelatorioModel } from "@features/relatorio/types";
import { FileAPI } from "@infrastructure/api/FileAPI";
import { fileExists, saveFile } from "@shared/utils";

export class FileService {
  async getMissingFilesFromServer(relatorio: RelatorioModel) {
    const { id, pictureURI, assinaturaURI } = relatorio;

    const updatedURIs: Partial<
      Record<"id" | "pictureURI" | "assinaturaURI", string>
    > = { id };

    const uris = await Promise.all([
      this.updateURI(pictureURI, "pictureURI"),
      this.updateURI(assinaturaURI, "assinaturaURI"),
    ]);

    uris.forEach((uri, index) => {
      const key = index === 0 ? "pictureURI" : "assinaturaURI";
      updatedURIs[key] = uri;
    });

    return updatedURIs;
  }

  async updateURI(uri: string, type: "pictureURI" | "assinaturaURI") {
    if (!uri) {
      return;
    }

    const existingURI = await this.fileExists(uri, type);
    if (existingURI) {
      console.log(
        "🚀 @@@@@@@ FileService.ts:35 getting file from App cache:",
        existingURI
      );
      return existingURI;
    }
    const blob = await FileAPI.downloadFileFromServer(uri);
    if (blob) {
      console.log("🚀 ######## FileService.ts:49 downloaded blob: " + type);
      const fileURI = await saveFile(
        uri,
        blob,
        type === "pictureURI" ? "jpeg" : "png"
      );
      if (fileURI) {
        return fileURI;
      }
    }
  }

  private fileExists = async (IdOrURI: string, type: string) => {
    if (IdOrURI.match("file://")) return IdOrURI;
    const { folder, fileWithExtension } = this.getFilePath(IdOrURI, type);
    const filePath = `${folder}/${fileWithExtension}`;
    const defaultFolder = FileSystem.documentDirectory;
    const filePath2 = defaultFolder + fileWithExtension;
    const { exists } = await fileExists(filePath);
    const { exists: existsInDefaultFolder } = await fileExists(filePath2);

    return exists ? filePath : existsInDefaultFolder ? filePath2 : "";
  };

  private getFilePath(fileId: string, type: string) {
    const folder =
      type === "pictureURI" ? env.PICTURE_FOLDER : env.ASSINATURA_FOLDER;
    const fileExtension = type === "pictureURI" ? "jpeg" : "png";
    return { folder, fileWithExtension: `${fileId}.${fileExtension}` };
  }
}
