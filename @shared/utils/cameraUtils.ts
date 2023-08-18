import { launchCameraAsync } from "expo-image-picker";

export const takePicture = async () => {
  const image = await launchCameraAsync({
    //allowsEditing: true,
    quality: 0.5,
  });
  if (image.assets && image.assets.length) {
    console.log(
      "🚀 ~ file: cameraUtils.ts:9 ~ takePicture ~ image.assets.length:",
      image.assets.length
    );
    return image.assets[0]?.uri;
  } else if (image.canceled) {
    console.log("User canceled the picture");
  } else {
    console.log("No image selected");
  }
};
