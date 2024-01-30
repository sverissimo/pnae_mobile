import {
  DadosProducaoIndustrialViewModel,
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
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import {
  dadosProducaoNaturaKeys,
  dadosIndustrialProducaoKeys,
} from "@infrastructure/api/perfil/constants/dadosDeProducaoKeys";
import { primeNumbersArray } from "@infrastructure/api/perfil/constants/primeNumbersArray";

import {
  convertArraysToStrings,
  convertBooleansToStrings,
  stringPropsToNumber,
  stringsPropsToBoolean,
} from "@infrastructure/utils/convertStringProps";
import { PerfilViewModel } from "../dto/PerfilViewModel";
import { log } from "@shared/utils/log";

export class PerfilDataMapper {
  constructor(
    private perfil: PerfilModel | any,
    private perfilOptions: PerfilOptions
  ) {
    this.perfil = { ...perfil };
    this.perfilOptions = perfilOptions;
  }

  modelToViewModel = () => {
    const perfilViewModel = this.changeDadosProdIndustrialKeys().build();
    return perfilViewModel;
  };

  perfilInputToModel = () => {
    const perfilModel = this.extractDadosProducao()
      .extractGruposProdutosView()
      .parseArrays()
      .booleanToStrings()
      .addDates()
      .build();

    return perfilModel as PerfilModel;
  };

  modelToRemoteDTO = () => {
    const perfilRemoteInputDTO = this.extractGruposProdutos()
      .getPrimeNumbersProps()
      .parseBooleanProps()
      .parseNumberProps()
      .build();
    return perfilRemoteInputDTO;
  };

  changeDadosProdIndustrialKeys = () => {
    const { dados_producao_agro_industria, ...rest } = this.perfil;
    const dadosProducaoIndustrial = {} as DadosProducaoIndustrialViewModel;

    for (const key in dados_producao_agro_industria) {
      if (key === "at_prf_see_grupos_produtos")
        (dadosProducaoIndustrial as any)[key] =
          dados_producao_agro_industria[key];

      const updatedKey = `${key}2` as keyof DadosProducaoIndustrialViewModel;

      (dadosProducaoIndustrial as any)[updatedKey] = (
        dados_producao_agro_industria as any
      )[key];
    }

    const perfilViewModel = {
      ...rest,
      dados_producao_agro_industria: dadosProducaoIndustrial,
    } as PerfilViewModel;

    this.perfil = perfilViewModel;
    return this;
  };

  extractGruposProdutosView = () => {
    const { perfil } = this;
    Object.assign(perfil, {
      at_prf_see_propriedade: {
        atividade: perfil.atividade,
      },
    });

    const { gruposNaturaOptions, gruposIndustrialOptions } = perfil;

    if (gruposIndustrialOptions) {
      perfil.dados_producao_agro_industria.at_prf_see_grupos_produtos =
        gruposIndustrialOptions;
      // perfil.gruposIndustrialOptions;
    }

    if (gruposNaturaOptions) {
      perfil.dados_producao_in_natura.at_prf_see_grupos_produtos =
        gruposNaturaOptions;
      // perfil.gruposNaturaOptions;
    }
    this.perfil = perfil;
    return this;
  };

  extractDadosProducao = () => {
    const p = this.perfil;

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
    // console.log({ dadosProducaoNatura, dadosProducaoIndustrial });
    this.perfil = p as PerfilModel;
    return this;
  };

  extractGruposProdutos = () => {
    const { gruposNaturaOptions, gruposIndustrialOptions, ...p } = this.perfil;
    const perfilModel = p as PerfilModel;
    const gruposProdutos = [gruposNaturaOptions, gruposIndustrialOptions];

    gruposProdutos.forEach((grupos, i) => {
      if (!grupos) return;

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
    });
    this.perfil = perfilModel;
    return this;
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

  getPrimeNumbersProps = () => {
    const { perfil, perfilOptions } = this;

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

    this.perfil = { ...perfil, ...result };
    return this;
  };

  private createPrimePropsObj = ({
    obj,
    primeNumberFields,
  }: {
    obj: Record<string, any>;
    primeNumberFields: string[];
    perfilOptions: PerfilOptions;
  }) => {
    if (!obj || typeof obj !== "object") return obj;
    const { perfilOptions } = this;
    const result = {} as any;
    for (const field of primeNumberFields) {
      let selectedOptions = obj[field] as string[] | string;

      if (!selectedOptions) continue;
      if (typeof selectedOptions === "string") {
        const regex = /, (?![^()]*\))/g;
        selectedOptions = selectedOptions.split(regex);
      }

      const availableOptions = perfilOptions[Perfil.toPefilOptionsProp(field)];

      result[field] = String(
        this.selectedOptionstoPrimeNumbers(selectedOptions, availableOptions)
      );
    }

    return result;
  };

  selectedOptionstoPrimeNumbers = (
    selectedOptions: string[],
    availableOptions: string[]
  ) => {
    const indexes = selectedOptions.map((option) =>
      availableOptions.indexOf(option)
    );
    console.log("🚀 - PerfilDataMapper - selectedOptions:", selectedOptions);

    console.log("🚀 - PerfilDataMapper - indexes:", indexes);
    let result = 1;
    indexes.forEach((index) => {
      result *= primeNumbersArray[index];
    });
    return result;
  };

  addDates = () => {
    const data_preenchimento = new Date().toISOString();
    const data_atualizacao = new Date().toISOString();
    console.log("🚀 - PerfilDataMapper - data_atualizacao:", data_atualizacao);

    this.perfil = { ...this.perfil, data_preenchimento, data_atualizacao };
    return this;
  };

  private parseArrays = () => {
    const p = convertArraysToStrings(this.perfil);
    this.perfil = p;
    return this;
  };

  private parseBooleanProps = () => {
    const { perfil } = this;
    const p = stringsPropsToBoolean(perfil);
    this.perfil = p;
    return this;
  };

  private booleanToStrings = () => {
    const { perfil } = this;
    const p = convertBooleansToStrings(perfil);
    this.perfil = p;
    return this;
  };

  private parseNumberProps = () => {
    const { perfil } = this;
    const p = stringPropsToNumber(perfil);
    this.perfil = p;
    return this;
  };

  build() {
    return this.perfil;
  }
}
