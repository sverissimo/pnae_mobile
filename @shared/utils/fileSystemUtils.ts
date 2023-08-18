import * as FileSystem from "expo-file-system";

export const deleteFile = async (fileURI: string) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileInfo.uri, { idempotent: true });
    console.log("deleted file:", !fileInfo.exists);
  }
};

export const fileExists = async (fileURI: string) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  return fileInfo;
};
