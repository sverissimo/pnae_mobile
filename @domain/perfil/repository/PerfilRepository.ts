import { Repository } from "@domain/Repository";
import { PerfilModel } from "../PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { GruposProdutosOptions } from "../GrupoProdutos";

export interface PerfilRepository extends Partial<Repository<PerfilModel>> {
  create(perfil: PerfilModel, perfilOptions?: PerfilOptions): Promise<void>;
  getPerfilOptions(): Promise<PerfilOptions>;
  savePerfilOptions?(perfilOptions: PerfilOptions): Promise<void>;
  getGruposProdutos(): Promise<GruposProdutosOptions>;
  saveGruposProdutos?(gruposProdutos: GruposProdutosOptions): Promise<void>;
}
