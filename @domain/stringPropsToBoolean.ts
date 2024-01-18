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
