import { env } from "../config";

export const getProdutorData = async (id: string) => {
  //id = id || "06627559609"; // dev/test purposes only
  //id = id || "15609048605"; // dev/test purposes only
  id = id || "04548773665"; // dev/test purposes only
  const response = await fetch(`${env.BASE_URL}/produtor/${id}`);

  const data = await response.json();
  return data;
};

export const createProdutor = async (produtor: any) => {
  try {
    const tst = {
      idShit: 12n,
      otherShoit: "123",
    };
    const result = await fetch(`${env.BASE_URL}/produtor`, {
      body: JSON.stringify(tst),
      method: "POST",
    });
  } catch (error) {}
};
