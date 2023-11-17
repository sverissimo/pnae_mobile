import { API } from "../../API";
import { env } from "@config/env";
import { AtendimentoModel, AtendimentoRepository } from "@domain/atendimento";
import { AtendimentoDTO } from "../dto/AtendimentoDTO";

export class AtendimentoAPIRepository
  implements Partial<AtendimentoRepository>
{
  private api = new API<AtendimentoModel>();
  private url = `${env.SERVER_URL}/atendimento`;

  async create(atendimentoDTO: AtendimentoDTO) {
    console.log("atAPI l18:", JSON.stringify(atendimentoDTO, null, 2));
    const response = await this.api.post(this.url, atendimentoDTO);
    console.log("🚀 ~ file: AtendimentoAPI.ts:25:", { response });
  }
}
