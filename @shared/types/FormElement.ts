export type FormElement = {
  field: string;
  label: string;
  type:
    | "select"
    | "selectMultiple"
    | "radio"
    | "input"
    | "image"
    | "textEditor"
    | "signature"
    | "toggle-input";
  options?: string[] | number[];
  dependsOn?: string;
  dependsOnValues?: string[];
  value?: string | boolean;
  key?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  customHelperField?: string;
  maxLength?: number;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  buttonLabel?: string;
  buttonLabelAlt?: string;
  icon?: string;
  iconAlt?: string;
};
