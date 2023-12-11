import { Repository } from "@domain/Repository";
import { PerfilModel } from "../PerfilModel";

export interface PerfilRepository extends Partial<Repository<PerfilModel>> {
  create(perfil: PerfilModel): Promise<void>;
  getPerfilOptions(): Promise<any>;
}
