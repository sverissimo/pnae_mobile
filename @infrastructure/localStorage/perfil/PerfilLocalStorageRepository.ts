import { PerfilModel } from "@domain/perfil";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { LocalStorageRepository } from "../LocalStorageRepository";

export class PerfilLocalStorageRepository
  extends LocalStorageRepository
  implements PerfilRepository
{
  protected readonly key = "id";
  protected readonly collection = "perfis";

  async findAll(): Promise<PerfilModel[]> {
    const allPerfils = await this.findAll();
    return allPerfils;
  }

  async create(perfil: PerfilModel): Promise<void> {
    await this.saveData(perfil.id, perfil);
  }

  async delete(id: string): Promise<void> {
    await this.removeData(id);
  }

  async getPerfilOptions(): Promise<any> {
    throw new Error("Method not implemented.");
    const perfilOptions = await this.getPerfilOptions();
    return perfilOptions;
  }
}
