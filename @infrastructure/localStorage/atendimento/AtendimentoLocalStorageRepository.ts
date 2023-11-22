import { LocalStorageRepository } from "../LocalStorageRepository";
import {
  Atendimento,
  AtendimentoModel,
} from "@domain/atendimento/entity/Atendimento";
import { AtendimentoRepository } from "@domain/atendimento";
import { AtendimentoDTO } from "@infrastructure/api/atendimento/dto/AtendimentoDTO";

export class AtendimentoLocalStorageRepository
  extends LocalStorageRepository
  implements AtendimentoRepository
{
  protected collection = "atendimentos";
  protected key = "id_relatorio";

  async create(atendimento: AtendimentoModel): Promise<void> {
    const { id_relatorio } = atendimento;

    await this.saveData(id_relatorio, atendimento);
    console.log("@@@@ AtendimentoLocalStorageRepository created atendimento.");
  }

  async findByRelatorioId(
    id_relatorio: string
  ): Promise<AtendimentoModel | null> {
    const atendimento = await this.findOne(id_relatorio);
    return atendimento;
  }

  async findAll(): Promise<AtendimentoModel[]> {
    const atendimentoes = await this.getAllEntities();
    return atendimentoes;
  }

  async update(entity: Partial<AtendimentoModel>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id_relatorio: string): Promise<void> {
    await this.removeData(id_relatorio);
  }
}
