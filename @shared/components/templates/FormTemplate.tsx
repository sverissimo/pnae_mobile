import { FormElement } from "@shared/types/FormElement";
import { View } from "react-native";
import {
  RadioComponent,
  PictureHolder,
  SelectDropdown,
  TextInputComponent,
} from "../organisms";

type FormTemplateProps = {
  form: FormElement[];
  data: any;
  onValueChange: any;
  showSignatureScreen?: any;
};

export function FormTemplate({
  form,
  data,
  onValueChange,
  showSignatureScreen,
}: FormTemplateProps) {
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
                value={
                  typeof data[item.field] === "number"
                    ? data[item.field].toString()
                    : data[item.field]
                }
                keyboardType={item.keyboardType}
              />
            );
          case "image":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                type="image"
                // onValueChange={(value: any) => onValueChange(item.field, value)}
                //imageURI={data[item.field]}
              />
            );
          case "signature":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                type="signature"
                showSignatureScreen={showSignatureScreen}
                //imageURI={data[item.field]}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
