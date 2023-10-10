import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
  getCameraPermissionsAsync,
  ImagePickerResult,
} from "expo-image-picker";
import { Alert } from "react-native";

type PickerResult = ImagePickerResult & { cancelled?: boolean };

export const takePicture = async () => {
  try {
    async function verifyPermission() {
      const permission = await getCameraPermissionsAsync();
      if (permission.granted) {
        return true;
      }
      // if (permission !== PermissionResponse.GRANTED) {
      //   await requestCameraPermissionsAsync();
      //   if (!PermissionStatus.GRANTED) {
      //     return false;
      //   }
      // }
    }

    const permission = await verifyPermission();
    if (!permission) {
      Alert.alert(
        "Permissão de câmera negada",
        "Para tirar uma foto, é necessário permitir o acesso à câmera",
        [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]
      );
      return;
    }
    const image: PickerResult = await launchCameraAsync({
      //allowsEditing: true,
      quality: 0.5,
    });
    delete image.cancelled;
    if (image.assets && image.assets.length) {
      return image.assets[0]?.uri;
    }
  } catch (error) {
    console.log("🚀 ~ file: cameraUtils.ts:41 ~ error:", error);
  }
};
