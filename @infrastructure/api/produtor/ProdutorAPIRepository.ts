import { ProdutorRepository } from "@domain/produtor/repository/ProdutorRepository";
import { env } from "../../../config/env";
import { Produtor } from "../../../features/produtor/types/Produtor";
import { API } from "../API";

export class ProdutorAPIRepository
  extends API<Produtor>
  implements ProdutorRepository
{
  url = `${env.SERVER_URL}/produtor`;

  findByCPF = async (cpf: string) => {
    // cpf = cpf || "06627559609"; // dev/test purposes only
    cpf = cpf || "15609048605"; // dev/test purposes only
    // cpf = cpf || "04548773665"; // dev/test purposes only
    // cpf = cpf || "02491855631"; // dev/test purposes only
    // cpf = cpf || "53804131107"; // dev/test purposes only
    // cpf = cpf || "14205771070"; // dev/test purposes only
    // cpf = cpf || "81756364672"; // dev/test purposes only
    // cpf = cpf || "05241895604"; // dev/test purposes only
    try {
      const data = await this.get(`${this.url}?cpfProdutor=${cpf}`);
      console.log("🚀 - findByCPF= - data:", data);
      if (data) {
        return data as Produtor;
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: produtorAPI.ts:10 ~ getProdutorData ~ error:",
        error
      );
    }
  };

  create = async (produtor: Produtor) => console.log("To be implemented...");
  update = async (produtor: Produtor) => console.log("To be implemented...");
}
