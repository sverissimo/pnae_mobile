import { View } from "react-native";

import { FormElement } from "@shared/types/FormElement";

import {
  PictureHolder,
  RadioComponent,
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
  return (
    <View>
      {form.map((item) => {
        switch (item.type) {
          case "select":
            return (
              <SelectDropdown
                key={item.key || item.field}
                label={item.label}
                options={item.options}
                onSelect={(value: any) => onValueChange(item.field, value)}
                value={data[item.field]}
              />
            );
          case "radio":
            return (
              <RadioComponent
                key={item.key || item.field}
                onValueChange={(value: any) => onValueChange(item.field, value)}
                label={item.label}
                value={data[item.field]}
              />
            );
          case "input":
            return (
              <TextInputComponent
                key={item.key || item.field}
                label={item.label}
                item={item}
                onChangeText={(value: any) => onValueChange(item.field, value)}
                value={
                  typeof data[item.field] === "number"
                    ? data[item.field].toString()
                    : data[item.field]
                }
                customHelper={
                  item.customHelperField ? data[item.customHelperField] : ""
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
