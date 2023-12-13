import { PerfilOptionsDTO } from "@infrastructure/api/perfil/PerfilOptionsDTO";
import { PerfilModel } from "./PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";

export class Perfil {
  private perfil: PerfilModel;
  constructor(perfil: PerfilModel) {
    // const {dados_producao_in_natura, dados_producao_agro_industria} = perfil

    this.perfil = perfil;
  }
  toModel = () => {
    return this.perfil;
  };

  static toPefilOptionsModel = (
    perfilOptionsDTO: PerfilOptionsDTO
  ): PerfilOptions => {
    const perfilOptions = perfilOptionsDTO.reduce((prev, curr) => {
      const { tipo, descricao } = curr;
      if (!prev[tipo]) {
        prev[tipo] = [descricao];
      } else {
        prev[tipo].push(descricao);
      }
      return prev;
    }, {} as any);
    return perfilOptions;
  };

  //   createProducaoNaturaForm(perfilOptions: PerfilOptions) {}
}
