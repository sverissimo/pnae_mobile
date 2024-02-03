export function cleanEmptyObjects(obj: any): any {
  // Check if the input is an object
  if (typeof obj === "object" && obj !== null) {
    // Iterate over object properties
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        // Filter out empty objects from arrays
        obj[key] = obj[key].filter(
          (item: any) => !(item && Object.keys(item).length === 0)
        );
        // Recursively clean each item in the array
        obj[key] = obj[key].map((item: any) => cleanEmptyObjects(item));
      } else if (typeof obj[key] === "object") {
        // Recursively clean nested objects
        obj[key] = cleanEmptyObjects(obj[key]);
      }
    }
  }
  return obj;
}
