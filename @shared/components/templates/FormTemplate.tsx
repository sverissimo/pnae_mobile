import { View } from "react-native";
import { FormElement } from "@shared/types/FormElement";
import {
  PictureHolder,
  RadioComponent,
  SelectDropdown,
  TextInputComponent,
} from "../organisms";
import { MultiSelectRow } from "../organisms/MultiSelectRow";
import { InsertGroupRow } from "../organisms/InsertGroupRow";
import MultiSelectBox from "../organisms/MultiSelectBox";

type FormTemplateProps = {
  form: FormElement[];
  data: any;
  onValueChange?: any;
  navigateTo?: any;
  customStyles?: any;
};

export function FormTemplate({
  form,
  data,
  onValueChange,
  navigateTo,
  customStyles,
}: FormTemplateProps) {
  return (
    <View>
      {form.map((item) => {
        if (!shouldRender(item, data)) {
          if (data[item.field]) {
            onValueChange(item.field, undefined);
          }
          return null;
        }

        switch (item.type) {
          case "select":
            return (
              <SelectDropdown
                key={item.key || item.field}
                label={item.label}
                options={item.options}
                onSelect={(value: any) => onValueChange(item.field, value)}
              />
            );
          case "selectMultiple":
            return (
              <MultiSelectRow
                key={item.key || item.field}
                item={item}
                selectedItems={data[item.field]}
              />
            );
          case "selectMultipleBox":
            return (
              <MultiSelectBox
                key={item.key || item.field}
                label={item.label}
                options={item.options! as string[]}
                selectedValues={data[item.field]}
                onSelectionChange={(selected) =>
                  onValueChange(item.field, selected)
                }
              />
            );
          case "navigateToScreen":
            return (
              <InsertGroupRow
                key={item.key || item.field}
                item={item}
                selectedItems={data[item.field]}
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
                label={
                  data?.sg_und_medida && item.field !== "area_utilizada"
                    ? item.label +
                      " (" +
                      data?.sg_und_medida?.toLowerCase() +
                      ")"
                    : item.label
                }
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
                customStyles={customStyles}
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

  function shouldRender(item: FormElement, state: any) {
    if (!item.dependsOn) return true;
    const shouldRender = item?.dependsOnValues?.includes(state[item.dependsOn]);
    return shouldRender;
  }
}
