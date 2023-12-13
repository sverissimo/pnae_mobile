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
  value?: string | boolean;
  key?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  customHelperField?: string;
  maxLength?: number;
  placeholder?: string;
  buttonLabel?: string;
  buttonLabelAlt?: string;
  icon?: string;
  iconAlt?: string;
};
