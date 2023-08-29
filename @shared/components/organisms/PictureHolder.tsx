import { ButtonInputComponent } from "./ButtonInputComponent";
import { FormFieldContainer, PictureTextListItem } from "../molecules";
import { FormElement } from "@shared/types";
import { useManagePictures } from "@shared/hooks/useManagePictures";

type PictureHolderProps = {
  item: FormElement;
  pictureURI?: string;
  type: "image" | "signature";
  showSignatureScreen?: (status: boolean) => void;
};

export const PictureHolder = ({
  item,
  type,
  showSignatureScreen,
}: PictureHolderProps) => {
  const { assinaturaURI, pictureURI, handleTakePicture } = useManagePictures();

  const handlePress = async () => {
    if (type === "image") {
      handleTakePicture();
    }
    if (type === "signature") {
      showSignatureScreen!(true);
    }
  };

  if (
    (!pictureURI && type === "image") ||
    (!assinaturaURI && type === "signature")
  )
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
    <FormFieldContainer label={item.label} key={item.field}>
      <PictureTextListItem
        pictureURI={type === "image" ? pictureURI! : assinaturaURI!}
        text={item.buttonLabelAlt || ""}
        icon={item.icon || ""}
        onPress={handlePress}
      />
    </FormFieldContainer>
  );
};
