import { env } from "@config/env";
import { API } from "../API";
// import { Perfil } from "@features/perfil/types";
import { PerfilRepository } from "@domain/perfil/repository/PerfilRepository";
import {
  DadosProducao,
  GrupoProdutos,
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

export class PerfilAPIRepository
  extends API<Perfil>
  implements PerfilRepository
{
  private url = `${env.SERVER_URL}/perfil`;

  async create(perfil: PerfilModel) {
    await this.post<PerfilModel>(`${this.url}/`, perfil);
  }

  async getPerfilOptions() {
    const perfilOptions = (await this.get(`${this.url}/options`)) as unknown;
    return perfilOptions as PerfilOptions;
  }

  async getGruposProdutos() {
    const gruposProdutos = (await this.get(`${this.url}/produtos`)) as unknown;
    return gruposProdutos as GrupoProdutos[];
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
    console.log("🚀 - file: PerfilAPIRepository.ts:45s", primeNumberFields);

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
