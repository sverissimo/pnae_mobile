export function parseURI(uri: string | undefined) {
  if (!uri) {
    return uri;
  }

  const parsedURI = uri.split("/").pop();
  return parsedURI;
}
