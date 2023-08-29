import * as FileSystem from "expo-file-system";

export const deleteFile = async (fileURI: string) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileInfo.uri, { idempotent: true });
    console.log("deleted file:", fileInfo.exists);
  }
};

export const fileExists = async (fileURI?: string) => {
  if (!fileURI) return { exists: false };
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  console.log(
    "🚀 ~ file: fileSystemUtils.ts:14 ~ fileExists ~ fileInfo:",
    fileInfo
  );
  return fileInfo;
};
