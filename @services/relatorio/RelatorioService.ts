import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { UsuarioService } from "../usuario/UsuarioService";
import { toDateMsec } from "@shared/utils/formatDate";
import { generateUUID } from "@shared/utils/generateUUID";
import { deleteFile } from "@shared/utils/fileSystemUtils";
import {
  RelatorioServiceConfig,
  defaultConfig,
} from "./RelatorioServiceConfig";

export class RelatorioService {
  private isConnected: boolean;
  private usuarioService: UsuarioService;
  private localRepository: RelatorioRepository;
  private remoteRepository: RelatorioRepository;

  constructor(
    relatorioServiceConfig: Partial<RelatorioServiceConfig> = defaultConfig
  ) {
    const config = { ...defaultConfig, ...relatorioServiceConfig };
    this.isConnected = config.isConnected;
    this.usuarioService = config.usuarioService;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;

    this.usuarioService.setConnectionStatus(this.isConnected);
  }

  createRelatorio = async (input: RelatorioModel): Promise<string> => {
    try {
      const id = generateUUID();
      const createdAt = new Date().toISOString();
      const readOnly = false;
      const relatorio = { ...input, id, readOnly, createdAt };

      const relatorioModel = new Relatorio(relatorio).toModel();

      await this.localRepository.create(relatorioModel);
      console.log("### Saved resultLocal ok.");

      if (this.isConnected) {
        const remoteResult = await this.remoteRepository.create(relatorioModel);
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
        console.error("RelatorioService -Error creating local reports:", error);
        throw error;
      }
    }

    if (this.isConnected && missingOnServer?.length) {
      try {
        await this.remoteRepository.createMany(missingOnServer);
      } catch (error) {
        console.error("RelatorioService - Error creating API reports:", error);
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
      let updatedRelatorios: RelatorioModel[] = relatoriosFromLocalDB;

      if (this.isConnected) {
        relatoriosFromServer = await this.remoteRepository.findByProdutorID(
          produtorId
        );
        updatedRelatorios = RelatorioDomainService.mergeRelatorios(
          relatoriosFromLocalDB,
          relatoriosFromServer
        );
        await this.saveUpdatedRelatorios(
          relatoriosFromLocalDB,
          updatedRelatorios
        );
      }

      const tecnicoIds =
        RelatorioDomainService.getTecnicosIdsFromRelatoriosList(
          updatedRelatorios
        );
      console.log(
        "🚀 - file: RelatorioService.ts:105 - RelatorioService - getRelatorios= - tecnicoIds:",
        tecnicoIds
      );

      const tecnicos = await this.usuarioService.getUsuariosByIds(tecnicoIds);

      const relatoriosWithTecnicos = updatedRelatorios.map((relatorio) =>
        RelatorioDomainService.addTecnicos(tecnicos!, relatorio)
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
        await this.remoteRepository.update(relatorioUpdate);
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
    outdatedOnClient: Partial<RelatorioModel>[];
    outdatedOnServer: Partial<RelatorioModel>[];
  }) {
    if (outdatedOnClient?.length) {
      await this.localRepository.updateMany!(outdatedOnClient);
    }
    if (this.isConnected && outdatedOnServer?.length) {
      await this.remoteRepository.updateMany!(outdatedOnServer);
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
        const result = await this.remoteRepository.delete(relatorioId);
        console.log("🚀 - RelatorioService deleted from server. ", result);

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
    const existingRelatoriosMap = new Map(
      existingRelatorios.map((er) => [er.id, er])
    );

    const relatoriosToCreate = [];
    const relatoriosToUpdate = [];

    for (const updatedRelatorio of updatedRelatorios) {
      const existing = existingRelatoriosMap.get(updatedRelatorio.id);
      if (!existing) {
        relatoriosToCreate.push(updatedRelatorio);
      } else if (existing.updatedAt !== updatedRelatorio.updatedAt) {
        relatoriosToUpdate.push(updatedRelatorio);
      }
    }

    await this.localRepository.createMany(relatoriosToCreate);
    console.log(`### Saved ${relatoriosToCreate.length} new rel. from server`);

    await this.localRepository.updateMany(relatoriosToUpdate);
    console.log(`### Updated ${relatoriosToUpdate.length} rel. from server`);
  };

  getLocalRelatorios = async () => await this.localRepository.findAll();
}
