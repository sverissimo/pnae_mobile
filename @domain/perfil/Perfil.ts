import { PerfilModel } from "./PerfilModel";

export class Perfil {
  private perfil: PerfilModel;
  constructor(perfil: PerfilModel) {
    // const {dados_producao_in_natura, dados_producao_agro_industria} = perfil

    this.perfil = perfil;
  }
  toModel = () => {
    return this.perfil;
  };

  //   createProducaoNaturaForm(perfilOptions: PerfilOptions) {}
}
