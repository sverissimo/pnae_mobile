import humps from "humps";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";
import { Relatorio } from "features/relatorio/types/Relatorio";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";

export const RelatorioService = {
  createRelatorio: async (relatorio: Relatorio) => {
    try {
      const relatorioLocalDTO = mapToDTO(relatorio);
      const resultLocal = await RelatorioDB.createRelatorio(relatorioLocalDTO);

      const relatorioId = await RelatorioAPI.createRelatorio(relatorio);
      return relatorioId;
    } catch (error: any) {
      console.error("🚀 RelatorioService.ts:31: ", error);
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
    try {
      const relatorioDTO = mapToDTO(relatorio);
      const result = await RelatorioDB.updateRelatorio(relatorioDTO);
      console.log("🚀 ~ file: RelatorioService.ts:47 ~ result:", result);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(`Failed to update relatorio: ${error}`);
      }
    }
  },

  getAllRelatorios: async () => {
    const relatorios = (await RelatorioDB.getAllRelatorios()) as RelatorioDTO[];
    return relatorios.map(toModel) as Relatorio[];
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
  if (relatorioDTO.numero_relatorio) {
    relatorioDTO.numero_relatorio = +relatorioDTO.numero_relatorio;
  }
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
