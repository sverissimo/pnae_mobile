import * as FileSystem from "expo-file-system";

export const getSignatureFileURI = async (signature: string) => {
  try {
    const fileName = `${Date.now()}.png`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    const base64Data = signature.replace("data:image/png;base64,", "");
    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.getInfoAsync(filePath);
    return filePath;
  } catch (error) {
    console.log("🚀file: signatureUtils.ts:20 error:", error);
  }
};
