import { Repository } from "@domain/Repository";
import { PerfilModel } from "../PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { GruposProdutosOptions } from "../GrupoProdutos";
import { PerfilDTO } from "@infrastructure/api/perfil/PerfilDTO";
import { ContractInfo } from "../ContractInfo";

export interface PerfilRepository extends Partial<Repository<PerfilModel>> {
  create(perfil: PerfilModel | PerfilDTO): Promise<void>;
  getPerfilOptions(): Promise<PerfilOptions | null>;
  savePerfilOptions?(perfilOptions: PerfilOptions): Promise<void>;
  getGruposProdutos(): Promise<GruposProdutosOptions | null>;
  saveGruposProdutos?(gruposProdutos: GruposProdutosOptions): Promise<void>;
  getContractInfo(): Promise<ContractInfo[] | null>;
  saveContractInfo?(contractInfo: any): Promise<void>;
}
