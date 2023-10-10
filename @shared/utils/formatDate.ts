export const formatDate = (date: string | undefined) => {
  if (typeof date !== "string") return date;
  const formattedDate = date
    .slice(0, "yyyy-mm-dd".length)
    .split("-")
    .reverse()
    .join("/");

  return formattedDate;
};

export const toDateMsec = (date: string | undefined): number => {
  if (typeof date !== "string") throw new Error("Invalid date format");

  if (date.length === "2023-10-09T20:22:24.253Z".length) {
    return new Date(date).getTime();
  } else if (date.length === "dd/mm/yyyy".length) {
    const [month, day, year] = date.split("/");
    const dateMsec = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).getTime();
    return dateMsec;
  }
  return Number(date);
};
