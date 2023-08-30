import humps from "humps";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";
import { Relatorio } from "features/relatorio/types/Relatorio";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";
import { generateUUID } from "@shared/utils/generateUUID";
import { deleteFile } from "@shared/utils";
import { getUpdatedProps } from "@shared/utils/getUpdatedProps";

export const RelatorioService = {
  createRelatorio: async (relatorio: Relatorio) => {
    try {
      relatorio.id = generateUUID();
      console.log(
        "🚀 ~ file: RelatorioService.ts:12 ~ createRelatorio: ~ relatorio:",
        relatorio
      );
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

  getAllRelatorios: async () => {
    const relatorios = (await RelatorioDB.getAllRelatorios()) as RelatorioDTO[];
    return relatorios.map(toModel) as Relatorio[];
  },

  updateRelatorio: async (relatorioInput: Relatorio) => {
    try {
      const updatedAt = new Date().toISOString();
      const { nomeTecnico, ...relatorio } = relatorioInput;
      const allRelatorios = await RelatorioDB.getAllRelatorios();

      const relatorioUpdate = getUpdatedProps(
        { ...relatorio, updatedAt },
        allRelatorios.map(toModel)
      );

      const relatorioDTO = mapToDTO(relatorioUpdate);
      const relatorioUpdatedDTO = await RelatorioDB.updateRelatorio(
        relatorioDTO
      );
      if (!relatorioUpdatedDTO) {
        throw new Error(`Failed to update relatorio locally: ${relatorio.id}`);
      }

      const result = await RelatorioAPI.updateRelatorio({
        ...relatorioUpdate,
        updatedAt,
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(`Failed to update relatorio: ${error}`);
      }
    }
  },

  deleteRelatorio: async (relatorioId: string) => {
    try {
      const relatorios = await RelatorioDB.getAllRelatorios();
      const { assinatura_uri, picture_uri } = relatorios.find(
        (r) => r.id === relatorioId
      )!;

      for (const file of [assinatura_uri, picture_uri]) {
        await deleteFile(file);
      }

      const resultLocal = await RelatorioDB.deleteRelatorio(relatorioId);
      if (!resultLocal) {
        throw new Error(`Failed to delete relatorio locally: ${relatorioId}`);
      }

      const result = await RelatorioAPI.deleteRelatorio(relatorioId);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`RelatorioService line80: ${error.message}`);
      } else {
        throw new Error(`Failed to delete relatorio: ${error}`);
      }
    }
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
