export type FormElement = {
  field: string;
  label: string;
  type: "select" | "radio" | "input" | "image" | "textEditor" | "signature";
  options?: string[] | number[];
  value?: string | boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  buttonLabel?: string;
  buttonLabelAlt?: string;
  icon?: string;
  iconAlt?: string;
};
