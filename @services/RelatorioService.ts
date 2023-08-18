import humps from "humps";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";
import { Relatorio } from "_types/Relatorio";

export const RelatorioService = {
  createRelatorio: async (relatorio: Relatorio) => {
    console.log(
      "🚀 ~ file: RelatorioService_rn.ts:8 ~ createRelatorio: ~ relatorio:",
      relatorio
    );
    if (relatorio?.numeroRelatorio) {
      relatorio.numeroRelatorio = +relatorio.numeroRelatorio;
    }

    const relatorioDTO = mapToDTO(relatorio);
    console.log(
      "🚀 ~ file: relatorioService.ts:17 ~ createRelatorio: ~ relatorioDTO:",
      relatorioDTO
    );

    const result = await RelatorioDB.createRelatorio(relatorioDTO);
    return result;
  },

  getRelatorios: async (produtorId: string): Promise<Relatorio[]> => {
    const relatorios = await RelatorioDB.getRelatorios(produtorId);
    const data = humps.camelizeKeys(relatorios) as Relatorio[];
    return data;
  },

  getAllRelatorios: async () => {
    const relatorios = (await RelatorioDB.getAllRelatorios()) as RelatorioDTO[];
    return relatorios.map(
      (relatorio) => humps.camelizeKeys(relatorio) as Relatorio
    );
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
