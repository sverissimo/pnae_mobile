import { pascalize } from "humps";
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

  static toPefilOptionsProp = (fieldLabel: string) => {
    const camelizedField = pascalize(fieldLabel)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/De/g, "")
      .replace(/Da/g, "")
      .replace(/Dos/g, "")
      .replace(/Do/g, "")
      .replace(/Que/g, "")
      .replace("ProcedimentoPosColheita", "ProcedimentosPosColheita")
      .replace("TipoEstabelecimento", "TipoOrganizacaoEstabelecimento");
    return camelizedField as keyof PerfilOptions;
  };

  //   createProducaoNaturaForm(perfilOptions: PerfilOptions) {}
}
