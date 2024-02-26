import { API } from "../../API";
import { env } from "@config/env";
import {
  Atendimento,
  AtendimentoModel,
  AtendimentoRepository,
} from "@domain/atendimento";

export class AtendimentoAPIRepository
  implements Partial<AtendimentoRepository>
{
  private api = new API<AtendimentoModel>();
  private url = `${env.SERVER_URL}/atendimento`;

  async create(atendimento: AtendimentoModel) {
    const atendimentoDTO = new Atendimento(atendimento).toDTO(env.SERVER_URL);

    const atendimentoId: string = await this.api.post(this.url, atendimentoDTO);
    console.log("🚀 ~ file: AtendimentoAPI.ts:25:", { atendimentoId });
    return atendimentoId;
  }
}
