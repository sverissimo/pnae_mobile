import { AtendimentoDTO } from "@infrastructure/api/atendimento/dto/AtendimentoDTO";
import { AtendimentoModel } from "../entity/Atendimento";
export interface AtendimentoRepository {
  create(atendimento: AtendimentoDTO | AtendimentoModel): Promise<void>;
  findByRelatorioId?(id_relatorio: string): Promise<AtendimentoModel | null>;
}
