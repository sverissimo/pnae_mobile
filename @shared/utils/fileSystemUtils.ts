import * as FileSystem from "expo-file-system";

export const saveFile = async (
  id: string,
  blob: Blob
): Promise<string | void> => {
  try {
    const localUri = `${FileSystem.documentDirectory}${id}.png`;
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
      "🚀 ~ file: FileAPI.ts:23 ~ saveFileFromServer ~ error:",
      error
    );
  }
};

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
