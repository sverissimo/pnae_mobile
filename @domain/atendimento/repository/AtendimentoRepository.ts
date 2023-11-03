import { AtendimentoDTO } from "@infrastructure/api/atendimento/dto/AtendimentoDTO";
import { AtendimentoModel } from "../entity/Atendimento";
export interface AtendimentoRepository {
  create(atendimento: AtendimentoModel): Promise<void>;
  toDTO(atendimento: AtendimentoModel): AtendimentoDTO;
}
