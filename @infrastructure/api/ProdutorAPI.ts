import { env } from "../../config";
import { Produtor } from "../../features/produtor/types/Produtor";

export const ProdutorAPI = {
  createProdutor: async (produtor: Produtor) => {
    try {
      const tst = produtor || {
        idShit: 12n,
        otherShoit: "123",
      };
      const result = await fetch(`${env.BASE_URL}/produtor`, {
        body: JSON.stringify(tst),
        method: "POST",
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: ProdutorAPI.ts:17 ~ createProdutor: ~ error:",
        error
      );
    }
  },

  getProdutor: async (cpf: string) => {
    // cpf = cpf || "06627559609"; // dev/test purposes only
    // cpf = cpf || "15609048605"; // dev/test purposes only
    // cpf = cpf || "04548773665"; // dev/test purposes only
    // cpf = cpf || "02491855631"; // dev/test purposes only
    // cpf = cpf || "53804131107"; // dev/test purposes only
    // cpf = cpf || "14205771070"; // dev/test purposes only
    // cpf = cpf || "81756364672"; // dev/test purposes only
    cpf = cpf || "05241895604"; // dev/test purposes only
    try {
      const url = `${env.BASE_URL}/produtor/${cpf}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("🚀 ~ file: ProdutorAPI.ts:42 ~ getProdutor: ~ data:", data);
      return data;
    } catch (error) {
      console.log(
        "🚀 ~ file: produtorAPI.ts:10 ~ getProdutorData ~ error:",
        error
      );
    }
  },
};
