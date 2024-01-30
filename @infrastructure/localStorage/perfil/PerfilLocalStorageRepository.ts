import { GruposProdutosOptions, PerfilModel } from "@domain/perfil";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import { LocalStorageRepository } from "../LocalStorageRepository";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { ContractInfo } from "@domain/perfil/ContractInfo";

export class PerfilLocalStorageRepository
  extends LocalStorageRepository
  implements PerfilRepository
{
  protected readonly key = "id";
  protected readonly collection = "perfis";

  async create(perfil: PerfilModel): Promise<void> {
    await this.saveData(perfil.id, perfil);
  }

  async delete(id: string): Promise<void> {
    await this.removeData(id);
  }

  async getPerfilOptions() {
    const perfilOptionsString = await this.storage.getItem("perfilOptions");
    if (!perfilOptionsString) {
      return null;
    }
    const perfilOptions = JSON.parse(perfilOptionsString) as PerfilOptions;
    return perfilOptions;
  }

  async savePerfilOptions(perfilOptions: PerfilOptions): Promise<void> {
    await this.storage.setItem("perfilOptions", JSON.stringify(perfilOptions));
  }

  async getGruposProdutos() {
    const gruposProdutosString = await this.storage.getItem("gruposProdutos");
    if (!gruposProdutosString) {
      return null;
    }

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

  async getContractInfo(): Promise<ContractInfo[] | null> {
    const contractInfoString = await this.storage.getItem("contractInfo");
    if (!contractInfoString) {
      return null;
    }
    const contractInfo = JSON.parse(contractInfoString || "{}");
    return contractInfo;
  }

  async saveContractInfo(contractInfo: ContractInfo[]): Promise<void> {
    await this.storage.setItem("contractInfo", JSON.stringify(contractInfo));
  }
}
