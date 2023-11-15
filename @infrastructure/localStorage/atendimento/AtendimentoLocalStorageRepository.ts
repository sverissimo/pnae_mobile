import { Repository } from "@domain/Repository";
import { LocalStorageRepository } from "../LocalStorageRepository";
import { AtendimentoModel } from "@domain/atendimento/entity/Atendimento";

export class AtendimentoLocalStorageRepository
  extends LocalStorageRepository
  implements Repository<AtendimentoModel>
{
  protected collection = "atendimentos";
  protected key = "id_relatorio";

  async create(atendimentoInput: AtendimentoModel): Promise<void> {
    const { id_relatorio, ...atendimento } = atendimentoInput;

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
    const atendimentoes = await this.getAllCollectionData();
    return atendimentoes;
  }

  async update(entity: Partial<AtendimentoModel>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id_relatorio: string): Promise<void> {
    await this.removeData(id_relatorio);
  }
}
