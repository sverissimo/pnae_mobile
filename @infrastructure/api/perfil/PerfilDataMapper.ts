import {
  GrupoDetails,
  GrupoProdutos,
  PerfilModel,
  Produto,
  ProdutoDetails,
} from "@domain/perfil";
import { Perfil } from "@domain/perfil/Perfil";
import {
  producaoNaturaForm,
  producaoIndustrialForm,
} from "@features/perfil/constants";
import { PerfilOptions } from "./PerfilOptions";
import { primeNumbersArray } from "./constants/primeNumbersArray";
import {
  dadosProducaoNaturaKeys,
  dadosIndustrialProducaoKeys,
} from "./constants/dadosDeProducaoKeys";
import {
  stringPropsToNumber,
  stringsPropsToBoolean,
} from "@infrastructure/utils/convertStringProps";

export class PerfilDataMapper {
  constructor(private perfilOptions: PerfilOptions) {}

  toDTO = (perfil: PerfilModel) => {
    const p = this.extractDadosProducao(perfil);
    const p2 = this.extractGruposProdutos(p);
    const p3 = this.getPrimeNumbersProps(p2, this.perfilOptions);
    const p4 = stringsPropsToBoolean(p3);
    const p5 = stringPropsToNumber(p4);
    const p6 = this.addDates(p5);
    return p6;
  };

  private extractDadosProducao = (perfil: any) => {
    const p = { ...perfil };

    const dadosProducaoNatura = {} as any;
    const dadosProducaoIndustrial = {} as any;

    for (const key in p) {
      if (dadosProducaoNaturaKeys.includes(key)) {
        dadosProducaoNatura[key] = p[key];
        delete p[key];
      }
      if (
        dadosIndustrialProducaoKeys.some((k) => k.match(key)) &&
        key.match("2")
      ) {
        const updatedKey = key.replace("2", "");

        dadosProducaoIndustrial[updatedKey] = p[key];
        delete p[key];
      }
    }
    p.dados_producao_in_natura = Object.keys(dadosProducaoNatura).length
      ? dadosProducaoNatura
      : undefined;
    p.dados_producao_agro_industria = Object.keys(dadosProducaoIndustrial)
      .length
      ? dadosProducaoIndustrial
      : undefined;
    return p;
  };

  private extractGruposProdutos = (perfil: any) => {
    const { gruposNaturaOptions, gruposIndustrialOptions, ...p } = perfil;
    const perfilModel = p as PerfilModel;
    const gruposProdutos = [gruposNaturaOptions, gruposIndustrialOptions];

    gruposProdutos.forEach((grupos, i) => {
      if (grupos) {
        const grupoProdutosDTO = grupos
          .filter((g: GrupoDetails & GrupoProdutos) => !!g.id_grupo)
          .map(this.extractGrupoProdutosDTO);

        if (i === 0) {
          perfilModel.dados_producao_in_natura.at_prf_see_grupos_produtos =
            grupoProdutosDTO;
        } else {
          perfilModel.dados_producao_agro_industria.at_prf_see_grupos_produtos =
            grupoProdutosDTO;
        }
      }
    });
    return perfilModel;
  };

  private extractGrupoProdutosDTO = (grupo: GrupoProdutos & GrupoDetails) => {
    const {
      tipo,
      nm_grupo,
      id_grupo_legado,
      dados_producao_estratificados_por_produto,
      at_prf_see_produto,
      ...grupoProdutos
    } = grupo;

    const parsedProduto = at_prf_see_produto
      .filter((p) => !!p.id_produto)
      .map(this.extractProdutoDTO);
    console.log("🚀 - PerfilDataMapper - parsedProduto:", parsedProduto);

    return {
      ...grupoProdutos,
      at_prf_see_produto: parsedProduto,
    };
  };

  private extractProdutoDTO = (produto: Produto & ProdutoDetails) => {
    const {
      id_produto,
      area_utilizada,
      producao_aproximada_ultimo_ano_pnae,
      producao_aproximada_ultimo_ano_total,
    } = produto;

    const produtoDTO = {
      id_produto,
      area_utilizada,
      producao_aproximada_ultimo_ano_pnae,
      producao_aproximada_ultimo_ano_total,
    };
    return produtoDTO;
  };

  getPrimeNumbersProps = (
    perfil: PerfilModel,
    perfilOptions: PerfilOptions
  ) => {
    const primeNumberFields = producaoNaturaForm
      .concat(producaoIndustrialForm)
      .filter((f) => f.type === "selectMultiple")
      .map((f) => f.field);

    const { dados_producao_agro_industria, dados_producao_in_natura } = perfil;
    const result = this.createPrimePropsObj({
      obj: perfil,
      primeNumberFields,
      perfilOptions,
    });
    if (dados_producao_in_natura) {
      const dadosNatura =
        this.createPrimePropsObj({
          obj: dados_producao_in_natura,
          primeNumberFields,
          perfilOptions,
        }) || {};
      Object.assign(result, {
        dados_producao_in_natura: {
          ...dados_producao_in_natura,
          ...dadosNatura,
        },
      });
    }
    if (dados_producao_agro_industria) {
      const dadosIndustria =
        this.createPrimePropsObj({
          obj: dados_producao_agro_industria,
          primeNumberFields,
          perfilOptions,
        }) || {};
      Object.assign(result, {
        dados_producao_agro_industria: {
          ...dados_producao_agro_industria,
          ...dadosIndustria,
        },
      });
    }

    const perfilDTO = { ...perfil, ...result };
    return perfilDTO;
  };

  private createPrimePropsObj = ({
    obj,
    primeNumberFields,
    perfilOptions,
  }: {
    obj: Record<string, any>;
    primeNumberFields: string[];
    perfilOptions: PerfilOptions;
  }) => {
    if (!obj || typeof obj !== "object") return obj;

    const result = {} as any;
    for (const field of primeNumberFields) {
      const selectedOptions = obj[field] as string[];
      if (!selectedOptions) continue;

      const availableOptions = perfilOptions[Perfil.toPefilOptionsProp(field)];

      result[field] = String(
        this.selectedOptionstoPrimeNumbers(selectedOptions, availableOptions)
      );
    }

    return result;
  };

  private selectedOptionstoPrimeNumbers = (
    selectedOptions: string[],
    availableOptions: string[]
  ) => {
    const indexes = selectedOptions.map((option) =>
      availableOptions.indexOf(option)
    );
    let result = 1;
    indexes.forEach((index) => {
      result *= primeNumbersArray[index];
    });
    return result;
  };

  private addDates = (perfil: PerfilModel) => {
    const data_preenchimento = new Date().toISOString();
    const data_atualizacao = new Date().toISOString();
    return { ...perfil, data_preenchimento, data_atualizacao };
  };
}
