import { RelatorioDB } from "@infrastructure/database/RelatorioDB";
import { RelatorioAPI } from "@infrastructure/api/RelatorioAPI";
import { FileAPI } from "@infrastructure/api/FileAPI";
import { UsuarioService } from "./UsuarioService";
import { generateUUID } from "@shared/utils/generateUUID";
import { deleteFile } from "@shared/utils";
import { getUpdatedProps } from "@shared/utils/getUpdatedProps";
import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioLocalDTO } from "../@infrastructure/database/dto/RelatorioLocalDTO";

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
      console.log("🚀 RelatorioService.ts:28 ~ remoteResult:", remoteResult);
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

    const relatoriosFromLocalDB = relatorioDTOs.map(Relatorio.toModel);

    const updatedRelatorios = mergeRelatorios(
      relatoriosFromLocalDB,
      relatoriosFromServer
    );

    const tecnicos = await UsuarioService.fetchTecnicosByRelatorios(
      updatedRelatorios
    );

    const relatoriosWithTecnicos = updatedRelatorios.map((relatorio) =>
      new Relatorio(relatorio).addTecnicos(tecnicos)
    );

    const updates = await Promise.all(
      relatoriosWithTecnicos.map(FileAPI.getMissingFilesFromServer)
    );
    console.log("🚀 RelatorioService.ts:65 ~ updates:", updates);
    return relatoriosWithTecnicos;
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

  getAllRelatorios: async () => {
    const relatorios =
      (await RelatorioDB.getAllRelatorios()) as RelatorioLocalDTO[];
    return relatorios;
  },
};

function mergeRelatorios(
  relatorios: RelatorioModel[],
  relatoriosFromServer: RelatorioModel[]
) {
  const relatoriosFromLocalDB = relatorios.map((relatorio) => {
    const serverRel = relatoriosFromServer.find(
      (r: RelatorioModel) => r.id === relatorio.id
    );
    const readOnly = serverRel?.readOnly || false;
    return { ...relatorio, read_only: readOnly };
  });

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

  [...relatoriosFromLocalDB, ...relatoriosFromServer].forEach(updateMap);
  const updatedRelatorios = Array.from(relatorioMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return updatedRelatorios;
}
