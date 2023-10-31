import { AtendimentoRepository } from "@domain/atendimento/repository/AtendimentoRepository";
import {
  Atendimento,
  AtendimentoModel,
} from "@domain/atendimento/entity/Atendimento";
import { AtendimentoAPI } from "@infrastructure/api/atendimento/AtendimentoAPI";

const atendimentoAPI: AtendimentoRepository = new AtendimentoAPI();

export class AtendimentoService {
  constructor(private repository: AtendimentoRepository = atendimentoAPI) {}

  create = async (
    atendimentoInput: AtendimentoModel
  ): Promise<boolean | void> => {
    try {
      const atendimentoModel = new Atendimento(atendimentoInput).toModel();
      await this.repository.create(atendimentoModel);
      return true;
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:31: ", error);
      throw new Error(error.message);
    }
  };
}
