import { Repository } from "@domain/Repository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { LocalStorageRepository } from "../LocalStorageRepository";
export class ProdutorLocalStorageRepository
  extends LocalStorageRepository
  implements Repository<ProdutorModel>
{
  protected collection = "produtores";
  protected key = "nr_cpf_cnpj";

  async create(produtor: ProdutorModel): Promise<void> {
    const cpfProdutor = produtor.nr_cpf_cnpj;
    await this.saveData(cpfProdutor, produtor);
    console.log("@@@@ ProdutorLocalStorageRepository created produtor.");
  }

  async findByCPF(cpf: string): Promise<ProdutorModel | undefined> {
    const produtor = await this.findOne(cpf);
    return produtor;
  }

  async findAll(): Promise<ProdutorModel[]> {
    const produtores = await this.getAllEntities();
    return produtores;
  }

  async update(entity: Partial<ProdutorModel>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(cpfProdutor: string): Promise<void> {
    await this.removeData(cpfProdutor);
  }
}
