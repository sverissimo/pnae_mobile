import { env } from "@config/env";
import { API } from "../API";
// import { Perfil } from "@features/perfil/types";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  DadosProducao,
  GrupoProdutos,
  GruposProdutosOptions,
  PerfilDTO,
  PerfilModel,
} from "@domain/perfil";
// import { PerfilModel } from "@domain/perfil/PerfilModel";
import {
  producaoIndustrialForm,
  producaoNaturaForm,
} from "@features/perfil/constants";
import { PerfilOptions } from "./PerfilOptions";
import { primeNumbersArray } from "./constants/primeNumbersArray";
import { Perfil } from "@domain/perfil/Perfil";
import { stringsPropsToBoolean } from "@domain/stringPropsToBoolean";
import createPerfilInput from "_mockData/perfil/createPerfilInput.json";
import perfilOptions from "_mockData/perfil/perfilOptions.json";
export class PerfilAPIRepository
  extends API<Perfil>
  implements PerfilRepository
{
  private url = `${env.SERVER_URL}/perfil`;

  async create(perfil: PerfilModel) {
    //@ts-ignore
    console.log("************", perfil?.gruposNaturaOptions);
    const p = this.extractDadosProducao(createPerfilInput);
    //@ts-ignore
    console.log("--------------", p?.gruposNaturaOptions);
    const perfilDTO = this.toPerfilDTO(p as PerfilModel, perfilOptions!);

    console.log("🚀 - create - perfilDTO:", perfilDTO);

    // const perfilOptions = await this.getPerfilOptions();
    // const perfilDTO = this.toPerfilDTO(perfil, perfilOptions!);
    // await this.post<PerfilModel>(`${this.url}/`, perfil);
  }

  async getPerfilOptions() {
    const perfilOptions = (await this.get(`${this.url}/options`)) as unknown;
    return perfilOptions as PerfilOptions;
  }

  async getGruposProdutos() {
    const gruposProdutos = (await this.get(`${this.url}/produtos`)) as unknown;
    return gruposProdutos as GruposProdutosOptions;
  }

  toPerfilDTO = (perfil: PerfilModel, perfilOptions: PerfilOptions) => {
    const p = stringsPropsToBoolean(perfil) as PerfilModel;
    const p2 = this.getPrimeNumbersProps(p, perfilOptions);
    return p2;
  };

  getPrimeNumbersProps = (
    perfil: PerfilModel,
    perfilOptions: PerfilOptions
  ) => {
    const primeNumberFields = producaoNaturaForm
      .concat(producaoIndustrialForm)
      .filter((f) => f.type === "selectMultiple")
      .map((f) => f.field as keyof PerfilDTO);

    const { dados_producao_agro_industria, dados_producao_in_natura } = perfil;
    const result = this.createPrimePropsObj({
      obj: perfil,
      primeNumberFields,
      perfilOptions,
    });
    const dadosNatura =
      this.createPrimePropsObj({
        obj: dados_producao_in_natura,
        primeNumberFields,
        perfilOptions,
      }) || {};
    const dadosIndustria =
      this.createPrimePropsObj({
        obj: dados_producao_agro_industria,
        primeNumberFields,
        perfilOptions,
      }) || {};
    Object.assign(dados_producao_in_natura, dadosNatura);
    Object.assign(dados_producao_agro_industria, dadosIndustria);
    Object.assign(result, {
      dados_producao_in_natura,
      dados_producao_agro_industria,
    });
    const PerfilDTO = { ...perfil, ...result };
    console.log(
      "🚀 - file: PerfilAPIRepository.ts:68 - PerfilDTO :",
      PerfilDTO
    );

    return PerfilDTO;
  };

  private extractDadosProducao = (perfil: any) => {
    const p = { ...perfil };
    const dadosProducaoKeys = [
      "controla_custos_producao",
      "dificuldade_fornecimento",
      "forma_entrega_produtos",
      "informacoes_adicionais",
      "local_comercializacao",
      "tipo_regularizacao_ambiental",
      "tipo_regularizacao_uso_recursos_hidricos",
      "valor_total_obtido_outros",
      "valor_total_obtido_pnae",
      "at_prf_see_grupos_produtos",
    ];
    const dados_producao_in_natura = {} as any;

    for (const key in p) {
      if (dadosProducaoKeys.includes(key)) {
        dados_producao_in_natura[key] = p[key];
        delete p[key];
      }
    }
    p.dados_producao_in_natura = dados_producao_in_natura;
    p.dados_producao_agro_industria = dados_producao_in_natura;
    return p;
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
}
