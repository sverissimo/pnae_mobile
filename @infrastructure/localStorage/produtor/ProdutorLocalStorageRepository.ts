import { Repository } from "@domain/Repository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { Produtor } from "@features/produtor/types/Produtor";
import { LocalStorageRepository } from "../LocalStorageRepository";
import { ProdutorLocalStorageDTO } from "./ProdutorLocalStorageDTO";
import { log } from "@shared/utils/log";

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

  async findByCPF(cpf: string): Promise<ProdutorModel | null> {
    const produtor = await this.findOne(cpf);
    return produtor;
  }

  async findAll(): Promise<ProdutorModel[]> {
    const produtores = await this.getAllCollectionData();
    return produtores;
  }

  async update(entity: Partial<ProdutorModel>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(cpfProdutor: string): Promise<void> {
    await this.removeData(cpfProdutor);
  }
}
