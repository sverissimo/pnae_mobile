import humps from "humps";

import { RelatorioDTO, RelatorioModel } from "@features/relatorio/types";
import { UsuarioAPI } from "@infrastructure/api";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";
import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { Usuario } from "@shared/types";
import { deleteFile, syncDBs } from "@shared/utils";
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
      relatorioLocalDTO.read_only = false;
      const resultLocal = await RelatorioDB.createRelatorio(relatorioLocalDTO);
      console.log("🚀 RelatorioService.ts:22:", resultLocal);

      const relatorioDTO = relatorioModel.toDTO();
      const remoteResult = await RelatorioAPI.createRelatorio(relatorioDTO);
      console.log(
        "🚀 ~ file: RelatorioService.ts:28 ~ createRelatorio: ~ remoteResult:",
        remoteResult
      );
      return relatorioId;
    } catch (error: any) {
      console.error("🚀 RelatorioService.ts:31: ", error);
      throw new Error(error.message);
    }
  },

  getRelatorios: async (produtorId: string): Promise<RelatorioModel[]> => {
    const [relatorioDTOs, relatoriosFromServer] = await Promise.all([
      RelatorioDB.getRelatorios(produtorId),
      RelatorioAPI.getRelatorios(produtorId),
    ]);
    console.log(
      "🚀 ~ file: RelatorioService.ts:40 ~ getRelatorios: ~ relatorioDTOs:",
      { produtorId, relatorioDTOs, relatoriosFromServer }
    );

    const tecnicoIds = getTecnicosIdsFromRelatoriosList(relatorioDTOs);
    const tecnicos = await UsuarioAPI.getUsuarios({
      ids: tecnicoIds.join(","),
    });

    // Update relatorioDTOs with server permissions and convert to models
    const relatorios = relatorioDTOs.map((dto) => {
      const serverRel = relatoriosFromServer.find(
        (r: RelatorioModel) => r.id === dto.id
      );
      const readOnly = serverRel?.readOnly || false;
      return Relatorio.toModel({ ...dto, read_only: readOnly }, tecnicos);
    });

    // Merge local and server relatorios, keeping the most recently updated
    const relatorioMap = new Map<string, RelatorioModel>();
    const updateMap = (relatorio: RelatorioModel) => {
      const existing = relatorioMap.get(relatorio.id);
      if (
        !existing ||
        new Date(relatorio.updatedAt) > new Date(existing.updatedAt)
      ) {
        relatorioMap.set(relatorio.id, relatorio);
      }
    };

    [...relatorios, ...relatoriosFromServer].forEach(updateMap);
    return Array.from(relatorioMap.values());
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
      if (relatorios.length) {
        const resultLocal = await RelatorioDB.deleteRelatorio(
          relatorioId
        ).catch((e) => console.log(e));
        if (resultLocal) {
          const { assinatura_uri, picture_uri } = relatorios.find(
            (r) => r.id === relatorioId
          )!;
          for (const file of [assinatura_uri, picture_uri]) {
            await deleteFile(file);
          }
        }
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
