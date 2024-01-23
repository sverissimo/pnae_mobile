export function stringsPropsToBoolean(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively convert nested objects and arrays
      result[key] = stringsPropsToBoolean(value);
    } else if (value === "true") {
      result[key] = true;
    } else if (value === "false") {
      result[key] = false;
    } else {
      result[key] = value;
    }
  }

  return { ...obj, ...result };
}

export function stringPropsToNumber(obj: Record<string, any>) {
  const numberProps = ["area_utilizada", "pessoas_processamento_alimentos"];
  const result = {} as any;
  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      result[key] = stringPropsToNumber(obj[key]);
      continue;
    }
    if (Array.isArray(obj[key])) {
      result[key] = obj[key].map((item: any) =>
        typeof item === "object" ? stringPropsToNumber(item) : item
      );
      continue;
    }
    if (numberProps.includes(key) && typeof obj[key] === "string") {
      result[key] = Number(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}
