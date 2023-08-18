import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { launchCameraAsync } from "expo-image-picker";
import { ButtonInputComponent } from "./ButtonInputComponent";
import { FormElement } from "@shared/types/FormElement";
import { PictureTextListItem } from "components/molecules/PictureTextListItem";
import { FormFieldContainer } from "components/molecules/FormFieldContainer";

type PictureHolderProps = {
  item: FormElement;
  imageURI?: string;
  type: "image" | "signature";
  onValueChange?: (value: any) => void;
  setShowSignature?: (status: boolean) => void;
};

export const PictureHolder = ({
  item,
  type,
  imageURI,
  onValueChange,
  setShowSignature,
}: PictureHolderProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imageURI) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [imageURI]);

  const handleTakeSignature = async () => {
    if (setShowSignature) setShowSignature(true);
  };

  const handleTakePicture = async () => {
    const image = await launchCameraAsync({
      //allowsEditing: true,
      quality: 0.5,
    });
    try {
      if (imageURI) {
        await deleteImage(imageURI);
      }

      if (image.assets && image.assets.length) {
        const pictureURI = image.assets[0]?.uri;
        console.log({ pictureURI });
        //setPictureURI(pictureURI);
        onValueChange!(pictureURI);
        //setLoaded(true);
      } else if (image.canceled) {
        console.log("User canceled the picture");
      } else {
        console.log("No image selected");
      }
    } catch (error) {
      console.log("🚀file: CreateRelatorioScreen.tsx:37", error);
    }
  };

  const deleteImage = async (oldImageURI: string) => {
    const fileInfo = await FileSystem.getInfoAsync(oldImageURI);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileInfo.uri, { idempotent: true });
      console.log("deleted cachedImage:", !fileInfo.exists);
    }
  };

  const handlePress = () => {
    if (type === "image") {
      console.log("🚀 ~ file: PictureHolder.tsx:74 ~ handlePress ~ image:");
      handleTakePicture();
    }
    if (type === "signature") {
      console.log("🚀 ~ file: PictureHolder.tsx:78 ~ handlePress ~ signature:");
      handleTakeSignature();
    }
  };

  if (!loaded && !imageURI)
    //if (!imageURI)
    return (
      <ButtonInputComponent
        key={item.field}
        label={item.label}
        item={item}
        buttonLabel={item.buttonLabel}
        onPress={handlePress}
      />
    );

  return (
    <FormFieldContainer label={item.label}>
      <PictureTextListItem
        pictureURI={imageURI!}
        text={item.buttonLabelAlt || ""}
        icon={item.icon || ""}
        onPress={handlePress}
      />
    </FormFieldContainer>
  );
};
