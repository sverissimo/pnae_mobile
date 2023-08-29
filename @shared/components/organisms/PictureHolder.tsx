import { useEffect, useState } from "react";
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
  const { pictureURI, handleTakePicture, assinaturaURI } = useManagePictures();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(!!pictureURI);
  }, [pictureURI]);

  const handlePress = async () => {
    if (type === "image") {
      handleTakePicture();
    }
    if (type === "signature") {
      showSignatureScreen!(true);
    }
  };

  if (!loaded && !pictureURI)
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
        pictureURI={type === "image" ? pictureURI! : assinaturaURI}
        text={item.buttonLabelAlt || ""}
        icon={item.icon || ""}
        onPress={handlePress}
      />
    </FormFieldContainer>
  );
};

// if (pictureURIList) {
//   console.log("🚀 PictureHolder.tsx:41 length:", pictureURIList.length);
// for (const uri of pictureURIList) {
//   console.log("🚀 ~ PictureHolder.tsx:47:", uri.split("/").pop());
//   const { exists } = await fileExists(uri);
//   console.log(
//     "🚀 ~ file: PictureHolder.tsx:50 ~ handlePress ~ exists:",
//     exists
//   );
// }
// }
