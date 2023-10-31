import { db } from "@infrastructure/database/config";
import { generateUUID } from "@shared/utils/generateUUID";
import { RelatorioAPI } from "@infrastructure/api/relatorio/repository/RelatorioAPI";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { UsuarioService } from "./UsuarioService";
import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { toDateMsec } from "@shared/utils/formatDate";
import { deleteFile } from "@shared/utils/fileSystemUtils";
import { RelatorioRepositoryImpl } from "@infrastructure/database/relatorio/repository/RelatorioRepositoryImpl";
import { RelatorioExpoSQLDAO } from "@infrastructure/database/relatorio/dao/RelatorioExpoSQLDAO";
import { FileService } from "./FileService";
import { getURIFromID } from "@shared/utils";
import createRelatorioInput from "../_mockData/createRelatorioInput.json";

const relatorioAPI: RelatorioRepository = new RelatorioAPI();
const relatorioDAO = new RelatorioExpoSQLDAO(db);
const relatorioExpoSQLRepository = new RelatorioRepositoryImpl(relatorioDAO);

export class RelatorioService {
  constructor(
    private isConnected: boolean,
    private repository: RelatorioRepository = relatorioExpoSQLRepository
  ) {
    this.isConnected = isConnected;
    this.repository = repository;
  }

  createRelatorio = async (input: RelatorioModel): Promise<string> => {
    try {
      const id = generateUUID();
      const createdAt = new Date().toISOString();
      const readOnly = false;
      const relatorio = { ...input, id, readOnly, createdAt };

      // Object.assign(relatorio, createRelatorioInput); // Testing ONLY!!!

      const relatorioModel = new Relatorio(relatorio).toModel();

      await this.repository.create(relatorioModel);
      console.log("### Saved resultLocal ok.");

      if (this.isConnected) {
        const remoteResult = await new RelatorioAPI().create(relatorioModel);
        console.log("🚀 RelatorioService.ts:28 ~ remoteResult:", remoteResult);
      }

      return id;
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:60: ", error);
      throw new Error(error.message);
    }
  };

  getRelatorios = async (produtorId: string): Promise<RelatorioModel[]> => {
    try {
      const relatoriosFromLocalDB = await this.repository.findByProdutorID(
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

      relatoriosWithTecnicos.sort((a, b) => {
        const aDate = toDateMsec(a.createdAt);
        const bDate = toDateMsec(b.createdAt);
        return aDate - bDate;
      });

      return relatoriosWithTecnicos;
    } catch (error) {
      console.log("🚀 ~ file: RelatorioService.ts:92 ~ getRelatorios:", error);
      throw error;
    }
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
      const relatorioUpdate = new Relatorio(relatorio).getUpdate({
        ...originalRelatorio,
        pictureURI: getURIFromID(originalRelatorio.pictureURI),
        assinaturaURI: getURIFromID(originalRelatorio.assinaturaURI),
      });
      console.log(
        "🚀 - RelatorioService - originalRelatorio:",
        JSON.stringify({ originalRelatorio, relatorioUpdate }, null, 2)
      );

      await this.repository.update(relatorioUpdate);
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
    try {
      const relatorioToDelete = await this.repository.findById!(relatorioId);
      if (!relatorioToDelete) {
        throw new Error(`Relatório não encontrado.`);
      }

      await this.repository.delete(relatorioId);

      const { assinaturaURI, pictureURI } = relatorioToDelete;
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
  };

  getAllRelatorios = async () => await this.repository.findAll();
}
