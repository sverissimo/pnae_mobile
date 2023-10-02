import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
  getCameraPermissionsAsync,
} from "expo-image-picker";
import { Alert } from "react-native";

export const takePicture = async () => {
  // const { granted } = await getCameraPermissionsAsync();
  // if (!granted) { }
  const { granted } = await requestCameraPermissionsAsync();
  console.log("🚀 ~ file: cameraUtils.ts:13 ~ takePicture ~ granted:", granted);
  if (!granted) {
    Alert.alert(
      "Permissão para utilização da câmera é necessária.",
      "Para utilizar essa funcioinalidade, favor habilitar a permissão para a utilização da câmera para o PNAE App."
    );
    return;
  }

  const image = await launchCameraAsync({
    //allowsEditing: true,
    quality: 0.5,
  });
  if (image.assets && image.assets.length) {
    return image.assets[0]?.uri;
  } else if (image.canceled) {
    console.log("User canceled the picture");
  } else {
    console.log("No image selected");
  }
};
