export type FormElement = {
  field: string;
  label: string;
  type: "select" | "radio" | "input";
  options?: string[] | number[];
  value?: string | boolean;
};
