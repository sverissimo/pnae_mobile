import humps from "humps";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";
import { Relatorio } from "_types/Relatorio";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";

export const RelatorioService = {
  createRelatorio: async (relatorio: Relatorio) => {
    if (relatorio?.numeroRelatorio) {
      relatorio.numeroRelatorio = +relatorio.numeroRelatorio;
    }

    const result = await RelatorioAPI.createRelatorio(relatorio);
    return result;
    //const relatorioDTO = mapToDTO(relatorio);
    //const result = await RelatorioDB.createRelatorio(relatorioDTO);
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

// function mapToDTO(relatorio: Relatorio): RelatorioDTO {
//   const relatorioDTO = humps.decamelizeKeys(relatorio, {
//     process: (key, convert, options) => {
//       if (key === "pictureURI") {
//         return "picture_uri";
//       }
//       if (key === "assinaturaURI") {
//         return "assinatura_uri";
//       }
//       return convert(key, options);
//     },
//   }) as RelatorioDTO;
//   return relatorioDTO;
// }
