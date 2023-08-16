import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FormElement } from "../../@shared/types/FormElement";
import { SelectDropdown } from "../organisms/SelectDropdown";
import { RadioComponent } from "../organisms/RadioComponent";
import { TextInputComponent } from "../organisms/TextInputComponent";
import { ButtonInputComponent } from "components/organisms/ButtonInputComponent";

type FormTemplateProps = {
  form: FormElement[];
  data: any;
  onValueChange: any;
  onPressButton?: any;
};
export function FormTemplate({
  form,
  data,
  onValueChange,
  onPressButton,
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
                //@ts-ignore
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
                //@ts-ignore
                value={data[item.field]}
                keyboardType={item.keyboardType}
              />
            );
          case "button":
            return (
              <ButtonInputComponent
                key={item.field}
                label={item.label}
                item={item}
                buttonLabel={item.buttonLabel}
                onPress={(field: string) => onPressButton(field)}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({});
