import humps from "humps";
import {
  getAllRelatoriosFromLocal,
  getRelatoriosFromDB,
  saveRelatorioLocal,
} from "../@infrastructure/database/RelatorioDB";
import { Relatorio } from "../types/Relatorio";
import { RelatorioDTO } from "../@infrastructure/database/dto/RelatorioDTO";

export async function createRelatorio(relatorio: Relatorio) {
  if (relatorio?.numeroRelatorio) {
    relatorio.numeroRelatorio = +relatorio.numeroRelatorio;
  }

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
  console.log(
    "🚀 ~ file: relatorioService.ts:27 ~ createRelatorio ~ relatorioDTO:",
    relatorioDTO
  );
  const result = await saveRelatorioLocal(relatorioDTO);
  console.log(
    "🚀 ~ file: relatorioService.ts:6 ~ createRelatorio ~ result:",
    result
  );
  return result;
}

export async function getRelatorios(produtorId: any) {
  const relatorios = await getRelatoriosFromDB(produtorId);
  const data = humps.camelizeKeys(relatorios);
  console.log(
    "🚀 ~ file: relatorioService.ts:23 ~ getRelatorios ~ data:",
    data
  );
  return data;
}

export async function getAllRelatorios() {
  const relatorios = (await getAllRelatoriosFromLocal()) as RelatorioDTO[];
  console.log(
    "🚀 ~ file: relatorioService.ts:20 ~ getAllRelatorios ~ relatorios:",
    relatorios
  );
  return relatorios.map(
    (relatorio) => humps.camelizeKeys(relatorio) as Relatorio
  );
}
