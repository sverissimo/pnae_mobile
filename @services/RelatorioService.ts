import humps from "humps";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";
import { Relatorio } from "features/relatorio/types/Relatorio";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";
import { parseURI } from "@shared/utils/parseURI";

export const RelatorioService = {
  createRelatorio: async (relatorio: Relatorio) => {
    try {
      const relatorioLocalDTO = mapToDTO(relatorio);
      const resultLocal = await RelatorioDB.createRelatorio(relatorioLocalDTO);

      return resultLocal;

      // const relatorioDTO = {
      //   ...relatorio,
      //   assinaturaFileName: parseURI(relatorio?.assinaturaURI),
      //   fotoFileName: parseURI(relatorio?.pictureURI),
      //   numeroRelatorio: relatorio?.numeroRelatorio
      //     ? +relatorio?.numeroRelatorio
      //     : undefined,
      // };
      // const result = await RelatorioAPI.createRelatorio(relatorioDTO);
      // return result;
    } catch (error: any) {
      console.log(
        "🚀 ~ file: RelatorioService.ts:31 ~ createRelatorio: ~ error:",
        error
      );
      throw new Error(error.message);
    }
  },

  getRelatorios: async (produtorId: string): Promise<Relatorio[]> => {
    const relatorioDTOs: RelatorioDTO[] = await RelatorioDB.getRelatorios(
      produtorId
    );
    const data = relatorioDTOs.map(toModel) as Relatorio[];
    return data;
  },

  updateRelatorio: async (relatorio: Relatorio) => {
    console.log("updated! NOt! ...to be implemented");
  },

  getAllRelatorios: async () => {
    const relatorios = (await RelatorioDB.getAllRelatorios()) as RelatorioDTO[];
    console.log(
      "🚀 ~ file: RelatorioService.ts:26 ~ getAllRelatorios: ~ relatorios:",
      relatorios
    );
    return relatorios.map(toModel) as Relatorio;
  },
};

function mapToDTO(relatorio: Relatorio): RelatorioDTO {
  const relatorioDTO = humps.decamelizeKeys(relatorio, {
    process: (key, convert, options) => {
      if (key === "pictureURI") {
        return "picture_uri";
      }
      if (key === "assinaturaURI") {
        return "assinatura_uri";
      }
      return convert(key, options);
    },
  }) as RelatorioDTO;
  return relatorioDTO;
}

function toModel(relatorioDTO: RelatorioDTO): Relatorio {
  const relatorio = humps.camelizeKeys(relatorioDTO, {
    process: (key, convert, options) => {
      if (key === "picture_uri") {
        return "pictureURI";
      }
      if (key === "assinatura_uri") {
        return "assinaturaURI";
      }
      return convert(key, options);
    },
  }) as Relatorio;
  return relatorio;
}
