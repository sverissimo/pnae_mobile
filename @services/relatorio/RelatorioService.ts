import { db } from "@infrastructure/database/config/expoSQLite";
import { generateUUID } from "@shared/utils/generateUUID";
import { RelatorioAPIRepository } from "@infrastructure/api/relatorio/repository/RelatorioAPIRepository";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { UsuarioService } from "../usuario/UsuarioService";
import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { toDateMsec } from "@shared/utils/formatDate";
import { deleteFile } from "@shared/utils/fileSystemUtils";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { RelatorioExpoSQLDAO } from "@infrastructure/database/relatorio/dao/RelatorioExpoSQLDAO";

const relatorioAPI: RelatorioRepository = new RelatorioAPIRepository();
const relatorioDAO = new RelatorioExpoSQLDAO(db);
const relatorioExpoSQLRepository = new RelatorioSQLRepository(relatorioDAO);
const userService = new UsuarioService();

export class RelatorioService {
  constructor(
    private isConnected: boolean,
    private localRepository: RelatorioRepository = relatorioExpoSQLRepository,
    private apiRepository: RelatorioRepository = relatorioAPI,
    private usuarioService: UsuarioService = userService
  ) {}

  createRelatorio = async (input: RelatorioModel): Promise<string> => {
    try {
      const id = generateUUID();
      const createdAt = new Date().toISOString();
      const readOnly = false;
      const relatorio = { ...input, id, readOnly, createdAt };

      // Object.assign(relatorio, createRelatorioInput); // Testing ONLY!!!

      const relatorioModel = new Relatorio(relatorio).toModel();

      await this.localRepository.create(relatorioModel);
      console.log("### Saved resultLocal ok.");

      if (this.isConnected) {
        const remoteResult = await this.apiRepository.create(relatorioModel);
        console.log("🚀 RelatorioService.ts:28 ~ remoteResult:", remoteResult);
      }

      return id;
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:60: ", error);
      throw new Error(error.message);
    }
  };

  async createMany({
    missingOnClient,
    missingOnServer,
  }: {
    missingOnClient: RelatorioModel[];
    missingOnServer: RelatorioModel[];
  }) {
    if (missingOnClient?.length) {
      try {
        await this.localRepository.createMany(missingOnClient);
      } catch (error) {
        console.error("Error creating local reports:", error);
        throw error;
      }
    }

    if (this.isConnected && missingOnServer?.length) {
      try {
        await this.apiRepository.createMany(missingOnServer);
      } catch (error) {
        console.error("Error creating API reports:", error);
        throw error;
      }
    }
  }

  getRelatorios = async (produtorId: string): Promise<RelatorioModel[]> => {
    try {
      const relatoriosFromLocalDB = await this.localRepository.findByProdutorID(
        produtorId
      );
      let relatoriosFromServer: RelatorioModel[] = [];

      if (this.isConnected) {
        relatoriosFromServer = await this.apiRepository.findByProdutorID(
          produtorId
        );
      }

      const updatedRelatorios = RelatorioDomainService.mergeRelatorios(
        relatoriosFromLocalDB,
        relatoriosFromServer
      );
      await this.saveUpdatedRelatorios(
        relatoriosFromLocalDB,
        updatedRelatorios
      );
      const tecnicos = await this.usuarioService.fetchTecnicosByRelatorios(
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
      // *** Adicona updatedAt, remove unmodified props
      const relatorioUpdate = new Relatorio(relatorio).getUpdatedProps(
        originalRelatorio
      ) as Partial<RelatorioModel> & { id: string };

      await this.localRepository.update(relatorioUpdate);
      console.log("### Relatorio locally updated!!");

      if (this.isConnected) {
        await this.apiRepository.update(relatorioUpdate);
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

  async updateMany({
    outdatedOnClient,
    outdatedOnServer,
  }: {
    outdatedOnClient: RelatorioModel[];
    outdatedOnServer: RelatorioModel[];
  }) {
    if (outdatedOnClient?.length) {
      await this.localRepository.updateMany!(outdatedOnClient);
    }
    if (this.isConnected && outdatedOnServer?.length) {
      await this.apiRepository.updateMany!(outdatedOnServer);
    }
  }

  deleteRelatorio = async (relatorioId: string) => {
    try {
      const relatorioToDelete = await this.localRepository.findById!(
        relatorioId
      );
      if (!relatorioToDelete) {
        throw new Error(`Relatório não encontrado.`);
      }

      await this.localRepository.delete(relatorioId);

      const { assinaturaURI, pictureURI } = relatorioToDelete;
      for (const file of [assinaturaURI, pictureURI]) {
        await deleteFile(file);
      }
    } catch (e) {
      console.log("🚀 RelatorioService.ts:126: Not deleted locally!!", e);
    }
    try {
      if (this.isConnected) {
        const result = await this.apiRepository.delete(relatorioId);
        return result;
      }
      return;
    } catch (e) {
      const error = e instanceof Error ? new Error(e.message) : e;
      throw new Error(`Erro ao apagar o relatório: ${JSON.stringify(error)}`);
    }
  };

  saveUpdatedRelatorios = async (
    existingRelatorios: RelatorioModel[],
    updatedRelatorios: RelatorioModel[]
  ) => {
    const relatoriosToCreate = updatedRelatorios.filter((r) => {
      const existing = existingRelatorios.find((er) => er.id === r.id);
      return !existing;
    });
    const relatoriosToUpdate = updatedRelatorios.filter((r) => {
      const existing = existingRelatorios.find((er) => er.id === r.id);
      return existing && existing.updatedAt !== r.updatedAt;
    });

    for (const relatorio of relatoriosToCreate) {
      await this.localRepository.create(relatorio);
    }
    console.log(
      `### Saved ${relatoriosToCreate.length} new relatorios from server.`
    );

    for (const relatorio of relatoriosToUpdate) {
      await this.localRepository.update(relatorio);
    }
    console.log(
      `### Updated ${relatoriosToUpdate.length} relatorios from server.`
    );
  };

  getLocalRelatorios = async () => await this.localRepository.findAll();
}
