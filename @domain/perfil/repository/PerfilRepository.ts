import { Repository } from "@domain/Repository";
import { PerfilModel } from "../PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";

export interface PerfilRepository extends Partial<Repository<PerfilModel>> {
  create(perfil: PerfilModel): Promise<void>;
  getPerfilOptions(): Promise<PerfilOptions | null>;
  savePerfilOptions?(perfilOptions: PerfilOptions): Promise<void>;
}
