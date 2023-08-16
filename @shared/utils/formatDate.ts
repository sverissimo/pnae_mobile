export const formatDate = (date: string | undefined) => {
  if (typeof date !== "string") return date;
  const formattedDate = date
    .slice(0, "yyyy-mm-dd".length)
    .split("-")
    .reverse()
    .join("/");

  return formattedDate;
};
