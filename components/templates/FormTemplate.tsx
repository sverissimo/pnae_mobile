import { View } from "react-native";
import { FormElement } from "../../@shared/types/FormElement";
import { SelectDropdown } from "../organisms/SelectDropdown";
import { RadioComponent } from "../organisms/RadioComponent";
import { TextInputComponent } from "../organisms/TextInputComponent";
import { PictureHolder } from "components/organisms/PictureHolder";

type FormTemplateProps = {
  form: FormElement[];
  data: any;
  onValueChange: any;
  signatureCaptureHandler: any;
  setShowSignature: any;
};

export function FormTemplate({
  form,
  data,
  onValueChange,
  setShowSignature,
}: FormTemplateProps) {
  // console.log(
  //   "🚀 ~ file: FormTemplate.tsx:76 ~ {form.map ~ data[item.field]:",
  //   data
  // );
  return (
    <View>
      {form.map((item) => {
        switch (item.type) {
          case "select":
            return (
              <SelectDropdown
                key={item.field}
                label={item.label}
                options={item.options}
                onSelect={(value: any) => onValueChange(item.field, value)}
                value={data[item.field]}
              />
            );
          case "radio":
            return (
              <RadioComponent
                key={item.field}
                onValueChange={(value: any) => onValueChange(item.field, value)}
                label={item.label}
                value={data[item.field]}
              />
            );
          case "input":
            return (
              <TextInputComponent
                key={item.field}
                label={item.label}
                item={item}
                onChangeText={(value: any) => onValueChange(item.field, value)}
                value={data[item.field]}
                keyboardType={item.keyboardType}
              />
            );
          case "image":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                type="image"
                onValueChange={(value: any) => onValueChange(item.field, value)}
                imageURI={data[item.field]}
              />
            );
          case "signature":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                type="signature"
                setShowSignature={setShowSignature}
                imageURI={data[item.field]}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
