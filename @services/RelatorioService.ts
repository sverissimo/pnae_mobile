import humps from "humps";

import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioAPI } from "@infrastructure/api";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { Usuario } from "@shared/types";
import { deleteFile } from "@shared/utils";
import { generateUUID } from "@shared/utils/generateUUID";
import { getUpdatedProps } from "@shared/utils/getUpdatedProps";

import { RelatorioLocalDTO } from "../@infrastructure/database/dto/RelatorioLocalDTO";
import { Relatorio } from "@features/relatorio/entity";

export const RelatorioService = {
  createRelatorio: async (relatorio: RelatorioModel): Promise<string> => {
    try {
      const relatorioId = generateUUID();
      relatorio.id = relatorioId;
      const relatorioModel = new Relatorio(relatorio);
      const relatorioLocalDTO = relatorioModel.toLocalDTO();
      const resultLocal = await RelatorioDB.createRelatorio(relatorioLocalDTO);
      console.log("🚀 RelatorioService.ts:22:", resultLocal);

      const relatorioDTO = relatorioModel.toDTO();
      await RelatorioAPI.createRelatorio(relatorioDTO);
      return relatorioId;
    } catch (error: any) {
      console.error("🚀 RelatorioService.ts:31: ", error);
      throw new Error(error.message);
    }
  },

  getRelatorios: async (produtorId: string): Promise<RelatorioModel[]> => {
    const relatorioDTOs: RelatorioLocalDTO[] = await RelatorioDB.getRelatorios(
      produtorId
    );
    const tecnicoIds = getTecnicosIdsFromRelatoriosList(relatorioDTOs);
    const tecnicos = (await UsuarioAPI.getUsuarios(tecnicoIds)) as Usuario[];

    const relatorios = relatorioDTOs.map((r) =>
      Relatorio.toModel(r, tecnicos)
    ) as RelatorioModel[];

    return relatorios;
  },

  getAllRelatorios: async () => {
    const relatorios =
      (await RelatorioDB.getAllRelatorios()) as RelatorioLocalDTO[];
    return relatorios;
  },

  updateRelatorio: async (relatorioInput: RelatorioModel) => {
    try {
      const { nomeTecnico, createdAt, ...relatorio } = relatorioInput;
      const relatoriosList = await RelatorioService.getRelatorios(
        relatorioInput.produtorId
      );
      const originalRelatorio = relatoriosList.find(
        (r) => r.id === relatorio.id
      );

      const relatorioUpdate = getUpdatedProps(
        originalRelatorio!,
        relatorio
      ) as RelatorioModel;
      relatorioUpdate.updatedAt = new Date().toISOString();

      const relatorioLocalDTO = new Relatorio(relatorioUpdate).toLocalDTO();
      const relatorioUpdatedDTO = await RelatorioDB.updateRelatorio(
        relatorioLocalDTO
      );
      if (!relatorioUpdatedDTO) {
        throw new Error(`Failed to update relatorio locally: ${relatorio.id}`);
      }
      console.log("### Relatorio locally updated!!");

      const relatorioDTO = new Relatorio(relatorioUpdate).toDTO();
      const result = await RelatorioAPI.updateRelatorio(relatorioDTO);
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

function getTecnicosIdsFromRelatoriosList(
  relatoriosList: RelatorioLocalDTO[]
): string[] {
  const tecnicoIds = [
    ...new Set(
      relatoriosList
        // .map((r: Relatorio) => r?.tecnicoId?.toString())
        .reduce((acc: any, r: RelatorioLocalDTO) => {
          acc.push(r?.tecnico_id?.toString());
          acc.push(r?.outro_extensionista?.toString());
          return acc;
        }, [])
        .filter((id: string) => !!id)
    ),
  ];
  console.log("🚀 ~ file: RelatorioService.ts:129 ~ tecnicoIds:", tecnicoIds);
  if (!tecnicoIds.length) return [];
  return tecnicoIds as string[];
}

// function mapToDTO(relatorio: Relatorio): Partial<RelatorioDTO> {
//   const {
//     numeroRelatorio,
//     nomeTecnico,
//     outroExtensionista,
//     nomeOutroExtensionista,
//     matriculaOutroExtensionista,
//     ...rest
//   } = relatorio;

//   const relatorioDTO: Partial<Relatorio> = rest;
//   if (numeroRelatorio) {
//     relatorioDTO.numeroRelatorio = +numeroRelatorio;
//   }

//   relatorioDTO.outroExtensionista =
//     outroExtensionista?.map((e) => e.id_usuario).join(",") || undefined;

//   return relatorioDTO;
// }

// function toModel(relatorioDTO: RelatorioDTO, tecnicos?: Usuario[]): Relatorio {
//   const relatorio = humps.camelizeKeys(relatorioDTO, {
//     process: (key, convert, options) => {
//       if (key === "picture_uri") {
//         return "pictureURI";
//       }
//       if (key === "assinatura_uri") {
//         return "assinaturaURI";
//       }
//       return convert(key, options);
//     },
//   }) as Relatorio;
//   if (!tecnicos) return relatorio;

//   const tecnico = tecnicos.find(
//     (t) => t?.id_usuario == relatorioDTO?.tecnico_id
//   );

//   const outroExtensionista = tecnicos.filter(
//     (t) =>
//       relatorioDTO?.outro_extensionista &&
//       relatorioDTO.outro_extensionista.match(t.id_usuario)
//   );
//   const { nomeOutroExtensionista, matriculaOutroExtensionista } =
//     outroExtensionista.reduce(
//       (acc, t) => {
//         acc.nomeOutroExtensionista += t.nome_usuario + ",";
//         acc.matriculaOutroExtensionista += t.matricula_usuario + ",";
//         return acc;
//       },
//       { nomeOutroExtensionista: "", matriculaOutroExtensionista: "" }
//     );

//   const nomeTecnico = tecnico?.nome_usuario;
//   return {
//     ...relatorio,
//     nomeTecnico,
//     outroExtensionista,
//     nomeOutroExtensionista,
//     matriculaOutroExtensionista,
//   };
// }

// function decamelizeRelatorio(relatorio: Relatorio) {
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
