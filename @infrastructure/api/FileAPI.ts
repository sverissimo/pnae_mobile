import { env } from "@config/env";
import { RelatorioModel } from "@features/relatorio/types";
import { fileExists, saveFile } from "@shared/utils";

export const FileAPI = {
  getMissingFilesFromServer,
  saveFileFromServer,
};

async function getMissingFilesFromServer(relatorio: RelatorioModel) {
  const { id, pictureURI, assinaturaURI } = relatorio;
  const updatedURIs = {};

  if (!pictureURI.match("file://")) {
    const fileURI = await saveFileFromServer(pictureURI);
    const updatedURI = fileURI || pictureURI;
    await fileExists(updatedURI);
    relatorio.pictureURI = updatedURI;
    Object.assign(updatedURIs, { id, pictureURI: updatedURI });
  }

  if (!assinaturaURI.match("file://")) {
    const fileURI = await saveFileFromServer(assinaturaURI);
    const updatedURI = fileURI || assinaturaURI;
    await fileExists(updatedURI);
    relatorio.assinaturaURI = updatedURI;
    Object.assign(updatedURIs, { id, assinaturaURI: updatedURI });
  }

  return updatedURIs;
}

async function saveFileFromServer(id: string) {
  try {
    const url = env.SERVER_URL + `/files/${id}`;
    const response = await fetch(url);
    const data = await response.blob();
    const fileURI = await saveFile(id, data);
    return fileURI;
  } catch (error) {
    console.log(
      "🚀 ~ file: FileAPI.ts:23 ~ saveFileFromServer ~ error:",
      error
    );
  }
}
