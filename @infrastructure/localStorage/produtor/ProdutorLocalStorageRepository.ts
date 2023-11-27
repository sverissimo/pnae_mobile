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

  async getAllProdutoresIds(): Promise<string[]> {
    const allProdutores = await this.findAll();
    return allProdutores.map((produtor) => produtor.id_pessoa_demeter);
  }

  async update(produtor: ProdutorModel): Promise<void> {
    this.saveData(produtor.nr_cpf_cnpj, produtor);
  }

  async delete(cpfProdutor: string): Promise<void> {
    await this.removeData(cpfProdutor);
  }
}
