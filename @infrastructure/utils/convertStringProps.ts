export function stringsPropsToBoolean(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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

type PlainObject = Record<string, any>;

export function convertArraysToStrings(
  obj: PlainObject | PlainObject[]
): PlainObject | PlainObject[] {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "object" && item !== null) {
        return convertArraysToStrings(item);
      }
      return item;
    });
  } else {
    const result: PlainObject = {};

    for (const key in obj) {
      if (
        Array.isArray(obj[key]) &&
        obj[key].every((item: unknown) => typeof item === "string")
      ) {
        result[key] = obj[key].join(", ");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = convertArraysToStrings(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }

    return result;
  }
}

export function convertBooleansToStrings(
  obj: PlainObject | PlainObject[]
): PlainObject | PlainObject[] {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "object" && item !== null) {
        return convertBooleansToStrings(item);
      }
      return item;
    });
  } else {
    const result: PlainObject = {};

    for (const key in obj) {
      if (typeof obj[key] === "string") {
        result[key] =
          obj[key] === "true" ? "Sim" : obj[key] === "false" ? "Não" : obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = convertBooleansToStrings(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    console.log("🚀 - result:", result);

    return result;
  }
}
