import { env } from "@config/env";

export function parseURI(uri: string | undefined) {
  if (!uri) {
    return uri;
  }

  const parsedURI = uri.split("/").pop();
  return parsedURI;
}

export function getURIFromID(fileId: string) {
  if (fileId.match("file:/")) {
    return fileId;
  }
  const filesFolder = env.FILES_FOLDER;
  const extension = fileId.length === 36 ? "jpeg" : "png";
  return `${filesFolder}/${fileId}.${extension}`;
}
