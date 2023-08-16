export type FormElement = {
  field: string;
  label: string;
  type: "select" | "radio" | "input" | "image";
  options?: string[] | number[];
  value?: string | boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};
