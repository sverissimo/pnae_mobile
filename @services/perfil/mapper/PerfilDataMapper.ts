import {
  DadosProducaoIndustrialViewModel,
  GrupoDetails,
  GrupoProdutos,
  PerfilModel,
  Produto,
  ProdutoDetails,
} from "@domain/perfil";
import {
  producaoNaturaForm,
  producaoIndustrialForm,
} from "@features/perfil/constants";
import {
  dadosProducaoNaturaKeys,
  dadosIndustrialProducaoKeys,
} from "@infrastructure/api/perfil/constants/dadosDeProducaoKeys";

import {
  convertArraysToStrings,
  convertBooleansToStrings,
  stringPropsToNumber,
  stringsPropsToBoolean,
} from "@infrastructure/utils/convertStringProps";
import { PerfilViewModel } from "../dto/PerfilViewModel";
import { cleanEmptyObjects } from "../utils/cleanEmptyObjects";
import { PerfilInputDTO } from "../dto/PerfilInputDTO";

export class PerfilDataMapper {
  constructor(private perfil: PerfilModel | any) {
    this.perfil = JSON.parse(JSON.stringify(perfil));
  }

  modelToViewModel = () => {
    const perfilViewModel = this.changeDadosProdIndustrialKeys().build();
    return perfilViewModel;
  };

  perfilInputToModel = () => {
    const perfilModel = this.extractDadosProducao()
      .clearWrongDadosProducaoProps()
      .extractGruposProdutosView()
      .applyFunction(convertArraysToStrings)
      .applyFunction(cleanEmptyObjects)
      .applyFunction(convertBooleansToStrings)
      .addDates()
      .build();

    return perfilModel as PerfilModel;
  };

  modelToRemoteDTO = () => {
    const perfilRemoteInputDTO = this.extractGruposProdutos()
      .applyFunction(stringsPropsToBoolean)
      .applyFunction(stringPropsToNumber)
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

    const {
      gruposNaturaOptions,
      gruposIndustrialOptions,
      dados_producao_in_natura,
      dados_producao_agro_industria,
    } = perfil;

    if (
      gruposNaturaOptions &&
      dados_producao_in_natura &&
      perfil.atividade !== "Atividade Secundária"
    ) {
      perfil.dados_producao_in_natura.at_prf_see_grupos_produtos =
        gruposNaturaOptions;
    }

    if (
      gruposIndustrialOptions &&
      dados_producao_agro_industria &&
      perfil.atividade !== "Atividade Primária"
    ) {
      perfil.dados_producao_agro_industria.at_prf_see_grupos_produtos =
        gruposIndustrialOptions;
    }

    this.perfil = perfil;
    return this;
  };

  extractDadosProducao = () => {
    const p = this.perfil;
    const { atividade } = p;

    const dadosProducaoNatura = {} as any;
    const dadosProducaoIndustrial = {} as any;

    for (const key in p) {
      if (dadosProducaoNaturaKeys.includes(key)) {
        dadosProducaoNatura[key] = p[key];
        delete p[key];
      }
      if (dadosIndustrialProducaoKeys.includes(key)) {
        const updatedKey = key.replace("2", "");

        dadosProducaoIndustrial[updatedKey] = p[key];
        delete p[key];
      }
    }
    p.dados_producao_in_natura =
      Object.keys(dadosProducaoNatura).length > 0 &&
      atividade !== "Atividade Secundária"
        ? dadosProducaoNatura
        : undefined;
    p.dados_producao_agro_industria =
      Object.keys(dadosProducaoIndustrial).length > 0 &&
      atividade !== "Atividade Primária"
        ? dadosProducaoIndustrial
        : undefined;

    this.perfil = p as PerfilModel;
    return this;
  };

  extractGruposProdutos = () => {
    const { gruposNaturaOptions, gruposIndustrialOptions, ...p } = this.perfil;
    const perfilModel = p as PerfilModel;
    const { atividade } = perfilModel.at_prf_see_propriedade;
    const gruposProdutos = [gruposNaturaOptions, gruposIndustrialOptions];

    gruposProdutos.forEach((grupos, i) => {
      if (!grupos) return;

      const grupoProdutosDTO = grupos
        .filter((g: GrupoDetails & GrupoProdutos) => !!g.id_grupo)
        .map(this.extractGrupoProdutosDTO);

      if (i === 0 && atividade !== "Atividade Secundária") {
        perfilModel.dados_producao_in_natura.at_prf_see_grupos_produtos =
          grupoProdutosDTO;
      } else if (i === 1 && atividade !== "Atividade Primária") {
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

    return {
      ...grupoProdutos,
      at_prf_see_produto: at_prf_see_produto
        .filter((p) => !!p.id_produto)
        .map(this.extractProdutoDTO),
    };
  };

  private extractProdutoDTO = (p: Produto & ProdutoDetails) => {
    return {
      id_produto: p.id_produto,
      area_utilizada: p.area_utilizada,
      producao_aproximada_ultimo_ano_pnae:
        p.producao_aproximada_ultimo_ano_pnae,
      producao_aproximada_ultimo_ano_total:
        p.producao_aproximada_ultimo_ano_total,
    };
  };

  private clearWrongDadosProducaoProps = () => {
    const perfil = { ...this.perfil };
    const { atividade } = perfil;
    const propsTodelete: string[] = [];

    for (const key in this.perfil) {
      if (atividade === "Atividade Primária") {
        producaoIndustrialForm.forEach((el) => propsTodelete.push(el.field));
      }

      if (atividade === "Atividade Secundária") {
        producaoNaturaForm.forEach((el) => propsTodelete.push(el.field));
      }

      if (propsTodelete.includes(key)) {
        delete perfil[key];
      }
    }

    this.perfil = perfil;
    return this;
  };

  addDates = () => {
    const data_preenchimento = new Date().toISOString();
    const data_atualizacao = new Date().toISOString();

    this.perfil = { ...this.perfil, data_preenchimento, data_atualizacao };
    return this;
  };

  private applyFunction(
    modifyFunction: (perfil: PerfilModel | PerfilInputDTO) => void
  ) {
    this.perfil = modifyFunction(this.perfil);
    return this;
  }

  build() {
    return this.perfil;
  }
}
