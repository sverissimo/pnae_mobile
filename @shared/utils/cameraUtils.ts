import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
  getCameraPermissionsAsync,
  ImagePickerResult,
  getMediaLibraryPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Alert, Linking } from "react-native";

type PickerResult = ImagePickerResult & { cancelled?: boolean };

export const takePicture = async () => {
  try {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      openAndroidSettings();
      return;
    }

    const image: PickerResult = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    delete image.cancelled;
    if (image.assets && image.assets.length) {
      return image.assets[0]?.uri;
    }
  } catch (error) {
    console.log("🚀 ~ file: cameraUtils.ts:41 ~ error:", error);
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      openAndroidSettings();
      return;
    }

    throw new Error(
      "Erro ao utilizar a câmera. Verifique as permissões, limpe o cache do app e tente de novo."
    );
  }
};

async function verifyPermission() {
  const { granted: cameraPermission } = await getCameraPermissionsAsync();
  const { granted: mediaLibraryPermission } =
    await getMediaLibraryPermissionsAsync();
  if (!cameraPermission) {
    await requestCameraPermissionsAsync();
  }
  if (!mediaLibraryPermission) {
    await requestMediaLibraryPermissionsAsync();
  }

  const cameraAfter = await getCameraPermissionsAsync();
  const mediaAfter = await getMediaLibraryPermissionsAsync();

  return cameraAfter.granted && mediaAfter.granted;
}

function openAndroidSettings() {
  Alert.alert(
    "Permissão negada",
    "Essa funcionalidade precisa de permissão de acesso à câmera e aos arquivos de mídia. Deseja abrir as configurações para habilitá-las?",
    [
      {
        text: "Sim",
        onPress: () => Linking.openSettings(),
      },
      {
        text: "Não",
        onPress: () => {},
      },
    ]
  );
  return;
}
