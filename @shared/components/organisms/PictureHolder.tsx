import { ButtonInputComponent } from "./ButtonInputComponent";
import { FormFieldContainer, PictureTextListItem } from "../molecules";
import { FormElement } from "@shared/types";
import { useManagePictures } from "@shared/hooks/useManagePictures";
import { useMemo } from "react";

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

  const imageKey = useMemo(() => {
    if (pictureURI && assinaturaURI) {
      return `${pictureURI}-${assinaturaURI}`;
    }
    return `picture-${pictureURI || "loading"}-signature-${
      assinaturaURI || "loading"
    }`;
  }, [pictureURI, assinaturaURI]);

  const handlePress = async () => {
    if (type === "image") {
      try {
        handleTakePicture();
      } catch (error) {
        console.log("🚀 ~ file: PictureHolder.tsx:27 ~  error:", error);
        alert(JSON.stringify(error));
      }
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
        fieldName={item.field}
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
        key={imageKey}
      />
    </FormFieldContainer>
  );
};
