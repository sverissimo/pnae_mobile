import { GruposProdutosOptions, PerfilModel } from "@domain/perfil";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { LocalStorageRepository } from "../LocalStorageRepository";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";

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

  async getPerfilOptions(): Promise<PerfilOptions> {
    const perfilOptionsString = await this.storage.getItem("perfilOptions");
    const perfilOptions = JSON.parse(perfilOptionsString || "{}");
    return perfilOptions;
  }

  async savePerfilOptions(perfilOptions: PerfilOptions): Promise<void> {
    await this.storage.setItem("perfilOptions", JSON.stringify(perfilOptions));
  }

  async getGruposProdutos() {
    const gruposProdutosString = await this.storage.getItem("gruposProdutos");
    const gruposProdutos = JSON.parse(
      gruposProdutosString || "{}"
    ) as GruposProdutosOptions;

    return gruposProdutos;
  }

  async saveGruposProdutos(gruposProdutos: any) {
    await this.storage.setItem(
      "gruposProdutos",
      JSON.stringify(gruposProdutos)
    );
  }
}
