import { useEffect, useState } from "react";
import { ButtonInputComponent } from "./ButtonInputComponent";
import { FormElement } from "@shared/types/FormElement";
import { PictureTextListItem } from "components/molecules/PictureTextListItem";
import { FormFieldContainer } from "components/molecules/FormFieldContainer";
import { takePicture } from "@shared/utils/cameraUtils";
import { deleteFile } from "@shared/utils/fileSystemUtils";

type PictureHolderProps = {
  item: FormElement;
  imageURI?: string;
  type: "image" | "signature";
  onValueChange?: (value: any) => void;
  showSignatureScreen?: (status: boolean) => void;
};

export const PictureHolder = ({
  item,
  type,
  imageURI,
  onValueChange,
  showSignatureScreen,
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
    if (showSignatureScreen) {
      showSignatureScreen(true);
    }
  };

  const handleTakePicture = async () => {
    const pictureURI = await takePicture();
    if (pictureURI) onValueChange!(pictureURI);
    console.log({ pictureURI });
    if (pictureURI && imageURI) {
      await deleteFile(imageURI);
    }
  };

  const handlePress = () => {
    if (type === "image") {
      handleTakePicture();
    }
    if (type === "signature") {
      handleTakeSignature();
    }
  };

  if (!loaded && !imageURI)
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
