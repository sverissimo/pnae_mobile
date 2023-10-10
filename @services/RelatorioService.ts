import { RelatorioDB } from "@infrastructure/database/relatorio/repository/RelatorioDB";
import { RelatorioAPI } from "@infrastructure/api/relatorio/repository/RelatorioAPI";
import { FileAPI } from "@infrastructure/api/FileAPI";
import { UsuarioService } from "./UsuarioService";
import { generateUUID } from "@shared/utils/generateUUID";
import { deleteFile, toDateMsec } from "@shared/utils";
import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioDomainService } from "@domain/relatorio/services";

const relatorioAPI = new RelatorioAPI();
const relatorioDB = new RelatorioDB();

export class RelatorioService {
  constructor(private isConnected: boolean) {}

  createRelatorio = async (input: RelatorioModel): Promise<string> => {
    try {
      const id = generateUUID();
      const createdAt = new Date().toISOString();
      const readOnly = false;
      const relatorio = { ...input, id, readOnly, createdAt };

      const relatorioModel = new Relatorio(relatorio).toModel();

      await relatorioDB.create(relatorioModel);
      console.log("### Saved resultLocal ok.");

      console.log("🚀 RelatorioService.ts:30 ~ isConnected:", this.isConnected);
      if (this.isConnected) {
        const remoteResult = await relatorioAPI.create(relatorioModel);
        console.log("🚀 RelatorioService.ts:28 ~ remoteResult:", remoteResult);
      }

      return id;
    } catch (error: any) {
      console.error("🚀 RelatorioService.ts:31: ", error);
      throw new Error(error.message);
    }
  };

  getRelatorios = async (produtorId: string): Promise<RelatorioModel[]> => {
    const relatoriosFromLocalDB = await relatorioDB.findByProdutorID(
      produtorId
    );

    let relatoriosFromServer: RelatorioModel[] = [];

    if (this.isConnected) {
      relatoriosFromServer = await relatorioAPI.findByProdutorID(produtorId);
    }

    const updatedRelatorios = RelatorioDomainService.mergeRelatorios(
      relatoriosFromLocalDB,
      relatoriosFromServer
    );

    const tecnicos = await UsuarioService.fetchTecnicosByRelatorios(
      updatedRelatorios
    );

    const relatoriosWithTecnicos = updatedRelatorios.map((relatorio) =>
      RelatorioDomainService.addTecnicos(tecnicos, relatorio)
    ) as RelatorioModel[];

    if (this.isConnected) {
      await Promise.all(
        relatoriosWithTecnicos.map(FileAPI.getMissingFilesFromServer)
      );
    }
    // console.log("🚀 RelatorioService.ts:65 ~ updates:", updates);
    relatoriosWithTecnicos.sort((a, b) => {
      const aDate = toDateMsec(a.createdAt);
      const bDate = toDateMsec(b.createdAt);
      return aDate - bDate;
    });
    return relatoriosWithTecnicos;
  };

  updateRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const { id, produtorId } = relatorio;
      const relatoriosList = await this.getRelatorios(produtorId);
      const originalRelatorio = relatoriosList.find((r) => r.id === id);
      if (!originalRelatorio) {
        throw new Error(
          `Erro ao atualizar o relatorio número: ${relatorio.numeroRelatorio} - relatorio não encontrado.`
        );
      }
      // Adicona updatedAt, remove unmodified props
      const relatorioUpdate = new Relatorio(relatorio).getUpdate(
        originalRelatorio
      );
      console.log(
        "🚀 ~ file: RelatorioService.ts:94 ~ RelatorioService ~ updateRelatorio= ~ relatorioUpdate:",
        relatorioUpdate
      );
      await relatorioDB.update(relatorioUpdate);
      console.log("### Relatorio locally updated!!");

      if (this.isConnected) {
        await relatorioAPI.update(relatorioUpdate);
        console.log("### Relatorio updated on server!!");
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(`RelatorioService erro ao atualizar: ${error}`);
      }
    }
  };

  deleteRelatorio = async (relatorioId: string) => {
    const relatorios = await relatorioDB.findAll();
    if (relatorios.length) {
      try {
        await relatorioDB.delete(relatorioId);

        const { assinaturaURI, pictureURI } = relatorios.find(
          (r) => r.id === relatorioId
        )!;
        for (const file of [assinaturaURI, pictureURI]) {
          await deleteFile(file);
        }
      } catch (e) {
        console.log("🚀 RelatorioService.ts:126: Not deleted locally!!", e);
      }
      try {
        if (this.isConnected) {
          const result = await relatorioAPI.delete(relatorioId);
          return result;
        }
        return;
      } catch (e) {
        const error = e instanceof Error ? new Error(e.message) : e;
        throw new Error(`Erro ao apagar o relatório: ${JSON.stringify(error)}`);
      }
    }
  };

  getAllRelatorios = async () => await relatorioDB.findAll();
}
