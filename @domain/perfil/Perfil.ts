import { pascalize } from "humps";
import { PerfilModel } from "./PerfilModel";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import {
  perfilForm,
  producaoIndustrialForm,
  producaoNaturaForm,
} from "@features/perfil/constants";
import { FormElement } from "@shared/types";
import { produtoDetailsForm } from "@features/perfil/constants/produtoDetailsForm";
import { GrupoProdutosInput } from "./GrupoProdutos";

export class Perfil {
  constructor(private perfil: PerfilModel | PerfilInputDTO) {}

  getMissingProps = () => {
    const perfilInput = this.perfil as PerfilInputDTO;
    const mandatoryFields = this.getMandatoryFields();

    const missingFields = mandatoryFields.filter((field) => {
      const value = perfilInput[field as keyof PerfilInputDTO];
      const emptyProp = !value || (Array.isArray(value) && value.length === 0);
      return emptyProp;
    });

    const gruposProdutosMissingProps =
      this.checkGruposProdutosMissingProps(perfilInput);

    return [...missingFields, ...gruposProdutosMissingProps];
  };

  checkGruposProdutosMissingProps = (perfilInput: PerfilInputDTO) => {
    const { atividade, gruposNaturaOptions, gruposIndustrialOptions } =
      perfilInput;

    const requiredProps = produtoDetailsForm.map(({ field }) => field);

    if (!gruposNaturaOptions && !gruposIndustrialOptions) {
      return ["gruposProdutos"];
    } else if (
      (atividade === "Ambas" && !gruposNaturaOptions) ||
      (atividade === "Ambas" && !gruposIndustrialOptions)
    ) {
      return ["gruposProdutos"];
    }

    const allMissingFields: string[] = [];

    if (gruposNaturaOptions && atividade !== "Atividade Secundária") {
      const naturaMissingFields = this.getGruposProdutosMissingProps(
        gruposNaturaOptions,
        requiredProps
      );
      allMissingFields.push(...naturaMissingFields);
    }

    if (gruposIndustrialOptions && atividade !== "Atividade Primária") {
      const industrialMissingFields = this.getGruposProdutosMissingProps(
        gruposIndustrialOptions,
        requiredProps.filter((prop) => prop !== "area_utilizada")
      );
      allMissingFields.push(...industrialMissingFields);
    }

    return Array.from(new Set(allMissingFields));
  };

  private getGruposProdutosMissingProps = (
    gruposNaturaOptions: GrupoProdutosInput[],
    requiredProps: string[]
  ) => {
    const naturaMissingFields = gruposNaturaOptions
      ?.filter((grupo) => grupo.nm_grupo)
      .map((grupo) => {
        if (!grupo.dados_producao_estratificados_por_produto) {
          return this.checkEmptyProps(grupo, requiredProps);
        }

        return grupo.at_prf_see_produto
          ?.filter((produto) => produto.nm_produto)
          .map((produto) => this.checkEmptyProps(produto, requiredProps))
          .flat();
      });

    const uniqueMissingFields = Array.from(
      new Set(naturaMissingFields?.flat())
    );

    return uniqueMissingFields;
  };

  private checkEmptyProps = (
    obj: Record<string, any>,
    requiredProps: string[]
  ) => {
    const missingProps = requiredProps.filter((prop) => {
      const value = obj[prop as keyof GrupoProdutosInput];
      return !value;
    });
    return missingProps;
  };

  private getMandatoryFields = () => {
    const { atividade } = this.perfil as PerfilInputDTO;
    const dadosProducaoForm =
      atividade === "Atividade Primária"
        ? producaoNaturaForm
        : atividade === "Atividade Secundária"
        ? producaoIndustrialForm
        : producaoNaturaForm.concat(producaoIndustrialForm);

    const mandatoryFields = perfilForm
      .concat(dadosProducaoForm)
      .filter(this.shouldBeMandatory)
      .map(({ field }) => field)
      .sort();
    return mandatoryFields;
  };

  private shouldBeMandatory = (field: FormElement) => {
    const perfil = this.perfil as PerfilInputDTO;
    const { dependsOn, dependsOnValues } = field;
    const dependsOnValue = perfil[dependsOn as keyof PerfilInputDTO];

    const dependsOnCheck =
      dependsOn &&
      dependsOnValue &&
      dependsOnValues?.includes(dependsOnValue as string);

    return (
      dependsOnCheck ||
      (!dependsOn && !field.field.match("informacoes_adicionais"))
    );
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
}
