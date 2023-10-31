import { AtendimentoModel } from "../entity/Atendimento";

export interface AtendimentoRepository {
  create(atendimento: AtendimentoModel): Promise<void>;
}
