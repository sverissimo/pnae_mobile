import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FormElement } from "../../@shared/types/FormElement";
import { SelectDropdown } from "../organisms/SelectDropdown";
import { RadioComponent } from "../organisms/RadioComponent";

type FormTemplateProps = {
  form: FormElement[];
  onValueChange: any;
  data: any;
};
export function FormTemplate({ form, data, onValueChange }: FormTemplateProps) {
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
          default:
            return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({});
