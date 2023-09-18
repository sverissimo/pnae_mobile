import { formatDate } from "./formatDate";

export const parseValue = (value: unknown): string => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "object":
      if (value === null) {
        return "";
      }
      if (value instanceof Date) {
        const date = formatDate(value.toISOString());
        if (date) {
          return date;
        }
      }
    case "boolean":
      return value ? "Sim" : "Não";
    default:
      return "";
  }
};
