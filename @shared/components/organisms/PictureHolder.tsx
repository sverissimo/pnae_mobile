import { ButtonInputComponent } from "./ButtonInputComponent";
import { FormFieldContainer, PictureTextListItem } from "../molecules";
import { FormElement } from "@shared/types";
import { useManagePictures } from "@shared/hooks/useManagePictures";

type PictureHolderProps<T> = {
  item: FormElement;
  data?: T;
  navigateTo?: (route: string) => void;
  onPressButton?: () => void;
};

export const PictureHolder = <T extends Object>({
  item,
  data,
  navigateTo,
}: PictureHolderProps<T>) => {
  const { assinaturaURI, pictureURI, handleTakePicture } = useManagePictures();
  const { type } = item;

  const handlePress = async () => {
    if (type === "image") {
      handleTakePicture();
    }
    if (type === "signature") {
      navigateTo!("GetSignatureScreen");
    }
    if (type === "textEditor") {
      navigateTo!("OrientacaoScreen");
    }
  };

  if (
    (!pictureURI && type === "image") ||
    (!assinaturaURI && type === "signature") ||
    type === "textEditor"
  )
    return (
      <ButtonInputComponent
        key={item.field}
        label={item.label}
        item={item}
        buttonLabel={!data ? item.buttonLabel! : item.buttonLabelAlt!}
        icon={!data ? item.icon! : item.iconAlt!}
        onPress={handlePress}
      />
    );

  return (
    <FormFieldContainer label={item.label} key={item.field}>
      <PictureTextListItem
        pictureURI={type === "image" ? pictureURI : assinaturaURI}
        text={item.buttonLabelAlt || ""}
        icon={item.iconAlt || ""}
        onPress={handlePress}
      />
    </FormFieldContainer>
  );
};
