export function parseURI(uri: string | undefined) {
  if (!uri) {
    return uri;
  }

  console.log("🚀 ~ file: parseURI.ts:4 ~ parseURI ~ uri:", uri);
  const parsedURI = uri.split("/").pop()?.toString();
  console.log("🚀 ~ file: parseURI.ts:7 ~ parseURI ~ parsedURI:", parsedURI);
  return parsedURI;
}
