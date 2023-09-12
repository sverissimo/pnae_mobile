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
  onValueChange?: any;
  navigateTo?: any;
};

export function FormTemplate({
  form,
  data,
  onValueChange,
  navigateTo,
}: FormTemplateProps) {
  console.log("🚀 ~ file: FormTemplate.tsx:23 ~ data:", data);

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
          case "textEditor":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                data={data[item.field]}
                navigateTo={navigateTo}
              />
            );
          case "image":
            return <PictureHolder item={item} key={item.field} />;

          case "signature":
            return (
              <PictureHolder
                item={item}
                key={item.field}
                data={data[item.field]}
                navigateTo={navigateTo}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
}
