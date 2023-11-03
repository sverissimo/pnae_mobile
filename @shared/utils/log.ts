export const log = (object: Record<string, any>) => {
  console.log(JSON.stringify(object, null, 2));
};
