import { API } from "../API";
import { env } from "@config/env";
import { AtendimentoModel, AtendimentoRepository } from "@domain/atendimento";
import { AtendimentoDTO } from "./dto/AtendimentoDTO";

export class AtendimentoAPI implements AtendimentoRepository {
  private api = new API<AtendimentoModel>();
  private url = `${env.SERVER_URL}/atendimento`;

  async create(atendimentoModel: AtendimentoModel) {
    const { id_relatorio, ...atendimento } = atendimentoModel;
    const link_pdf = `${this.url}/relatorios/pdf/${id_relatorio}`;

    const atendimentoDTO: AtendimentoDTO = {
      ...atendimento,
      link_pdf,
    };
    console.log("atAPI l18:", JSON.stringify(atendimentoDTO, null, 2));

    const response = await this.api.post(this.url, atendimentoDTO);
    console.log("🚀 ~ file: AtendimentoAPI.ts:25:", { response });
  }
}
