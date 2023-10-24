import * as FileSystem from "expo-file-system";

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
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(fileInfo.uri, { idempotent: false });
    console.log("deleted file:", fileInfo.exists);
  }
};

export const fileExists = async (fileURI?: string) => {
  if (!fileURI) return { exists: false, uri: "" };
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  return fileInfo;
};
