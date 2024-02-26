import * as FileSystem from "expo-file-system";
import { log } from "./log";
import { parseURI } from "./parseURI";
import { env } from "@config/env";

/**Returns the URI of the saved (or existing) file or throws an error */
export const saveFile = async (
  id: string,
  blob: Blob,
  fileExtension: string = "png"
): Promise<string | void> => {
  try {
    const localUri = `${FileSystem.documentDirectory}${id}.${fileExtension}`;
    const { exists } = await fileExists(localUri);
    if (exists) {
      return localUri;
    }

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1] || "";
      await FileSystem.writeAsStringAsync(localUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(`File saved to ${localUri}`);
    };
    return localUri;
  } catch (error) {
    console.log(
      "🚀 ~ file: FileAPI.ts:23 ~ downloadFileFromServer ~ error:",
      error
    );
  }
};

export const deleteFile = async (fileURI: string) => {
  let fileInfo;
  try {
    fileInfo = await FileSystem.getInfoAsync(fileURI);
    if (fileInfo?.exists) {
      await FileSystem.deleteAsync(fileInfo.uri, { idempotent: false });
      console.log("-------- deleted file:", fileInfo.uri);
    }
  } catch (error) {
    console.log("%%%% fileSystemUtils - not deleted:", parseURI(fileInfo?.uri));
    // console.log("🚀 - fileSystemUtils ~ 42 ~ deleteFile - error:", error);
  }
};

export const fileExists = async (fileURI?: string) => {
  if (!fileURI) return { exists: false, uri: "" };
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  console.log("🚀 - fileExists - fileInfo:", fileInfo);
  return fileInfo;
};

export const listFiles = async (folder: string) => {
  try {
    const files = await FileSystem.readDirectoryAsync(folder);
    const cache = FileSystem.cacheDirectory;
    // console.log("🚀 - listFiles - cache:", cache);
    return files;
  } catch (error) {
    console.log("Error listing files:", error);
  }
};

export const checkFiles = () => {
  listFiles(
    env.PICTURE_FOLDER
    // env.ASSINATURA_FOLDER
  ).then((files) => files && console.log("files", log(files)));
};
