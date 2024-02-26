import { Relatorio } from "@features/relatorio/entity";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioDomainService } from "@domain/relatorio/services";
import { UsuarioService } from "../usuario/UsuarioService";
import { toDateMsec } from "@shared/utils/formatDate";
import { deleteFile } from "@shared/utils/fileSystemUtils";
import {
  RelatorioServiceConfig,
  defaultConfig,
} from "./RelatorioServiceConfig";
import { AtendimentoModel } from "@domain/atendimento";
import { AtendimentoService } from "@services/atendimento/AtendimentoService";

export class RelatorioService {
  private isConnected: boolean;
  private usuarioService: UsuarioService;
  private localRepository: RelatorioRepository;
  private remoteRepository: RelatorioRepository;
  private syncService: typeof defaultConfig.syncService;
  private atendimentoService: AtendimentoService;

  constructor(
    relatorioServiceConfig: Partial<RelatorioServiceConfig> = defaultConfig
  ) {
    const config = { ...defaultConfig, ...relatorioServiceConfig };
    this.isConnected = config.isConnected;
    this.usuarioService = config.usuarioService;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
    this.atendimentoService = config.atendimentoService!;
    this.syncService = config.syncService;

    this.usuarioService.setConnectionStatus(this.isConnected);
    this.atendimentoService.setConnectionStatus(this.isConnected);
  }

  createRelatorio = async (
    relatorio: RelatorioModel,
    atendimentoInput?: AtendimentoModel
  ): Promise<string | undefined> => {
    try {
      //#### Quando rodar o relatorioSyncService -- Missing on CLIENT:
      //#### Se já tem atendimentoId, com certeza já foi criado atendimento E relatório no servidor
      // Hipótese excluída, o RelatorioSync chama direto o createMany do localRepository
      // if (relatorio.atendimentoId) {
      //   await this.createRelatorioLocal(relatorio);
      //   return;
      // }

      if (!this.isConnected) {
        await this.createRelatorioLocal(relatorio, atendimentoInput!);
        return;
      }
      const atendimento =
        atendimentoInput ||
        (await this.atendimentoService.getAtendimentoLocal(relatorio.id));
      //------SE ONLINE, cria primeiro no servidor para pegar o id do atendimento

      const atendimentoId = await this.createRelatorioRemote(
        relatorio,
        atendimento!
      );

      relatorio.atendimentoId = atendimentoId;
      console.log("🚀 - RelatorioService - atendimentoId:", atendimentoId);

      console.log("🚀 - RelatorioService - relatorio:", relatorio);

      //----DEPOIS, cria localmente caso o relatório esteja sendo criado ONLINE
      const localExists = await this.localRepository.findById!(relatorio.id);
      if (!localExists) {
        console.log("🚀 - RelatorioService - localExists:", localExists);

        await this.localRepository.create({ ...relatorio, atendimentoId });
      } else {
        //--------------- CASO criado offline e agora ESTEJA RODANDO SYNC: Missing on SERVER ----------------
        await this.localRepository.update({
          id: relatorio.id,
          atendimentoId,
        });
      }

      await this.atendimentoService.deleteAtendimentoLocal(relatorio.id);

      return atendimentoId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  private createRelatorioLocal = async (
    relatorio: RelatorioModel,
    atendimento?: AtendimentoModel
  ) => {
    await this.localRepository.create(relatorio);
    atendimento && (await this.atendimentoService.create(atendimento!));
    return;
  };

  private createRelatorioRemote = async (
    relatorio: RelatorioModel,
    atendimento: Omit<AtendimentoModel, "id_at_atendimento">
  ) => {
    const atendimentoModel = { ...atendimento };
    // ||      (await this.atendimentoService.getAtendimentoLocal(relatorio.id))!;

    const atendimentoId = await this.atendimentoService.create(
      atendimentoModel
    );

    relatorio.atendimentoId = atendimentoId;
    await this.remoteRepository.create(relatorio);

    // ###### Em todas as hipoteses, local terá o relatorio E O Atendimento!!!######
    // const localExists = await this.localRepository.findById!(relatorio.id);
    // if (!localExists) {
    //   await this.localRepository.create(relatorio);
    // }

    return atendimentoId;
  };

  getRelatorios = async (produtorId: string): Promise<RelatorioModel[]> => {
    let relatorios = await this.localRepository.findByProdutorId(produtorId);

    if (!this.isConnected) {
      console.log("@@@ not Connected, returning relatorios from local mem.");
      const relatoriosWithTecnicos = this.addTecnicosToRelatorio(relatorios);
      return relatoriosWithTecnicos;
    }

    if (!relatorios.length) {
      relatorios = await this.fetchFromServer(produtorId);
      console.log("### Fetching relatorios from server.");
    } else {
      console.log("### Syncing relatorios with server.");
      await this.syncService.syncRelatorios(produtorId);
      relatorios = await this.localRepository.findByProdutorId(produtorId);
    }

    const relatoriosWithTecnicos = await this.addTecnicosToRelatorio(
      relatorios
    );

    return relatoriosWithTecnicos;
  };

  updateRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const { id, produtorId, contratoId } = relatorio;
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
        await this.remoteRepository.update({
          ...relatorioUpdate,
          produtorId,
          contratoId,
        });
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
    if (!this.isConnected) {
      throw new Error(
        "Não é possível apagar o relatório sem conexão com a internet."
      );
    }

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

      console.log("@@@  deleted relatorio locally");
      await this.remoteRepository.delete(relatorioId);
    } catch (e) {
      const error = e instanceof Error ? new Error(e.message) : e;
      throw new Error(`Erro ao apagar o relatório: ${JSON.stringify(error)}`);
    }
  };

  private fetchFromServer = async (
    produtorId: string
  ): Promise<RelatorioModel[]> => {
    const relatoriosFromServer = await this.remoteRepository.findByProdutorId(
      produtorId
    );

    if (relatoriosFromServer?.length) {
      await this.localRepository.createMany(relatoriosFromServer);
    }
    return relatoriosFromServer;
  };

  private addTecnicosToRelatorio = async (
    relatorios: RelatorioModel[]
  ): Promise<RelatorioModel[]> => {
    if (!relatorios?.length) return relatorios;

    const tecnicoIds =
      RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatorios);

    const tecnicos = await this.usuarioService.getUsuariosByIds(tecnicoIds);

    const relatoriosWithTecnicos = relatorios
      .map((relatorio) =>
        RelatorioDomainService.addTecnicos(tecnicos, relatorio)
      )
      .sort((a, b) => toDateMsec(a.createdAt) - toDateMsec(b.createdAt));

    return relatoriosWithTecnicos;
  };

  getLocalRelatorios = async () => await this.localRepository.findAll();
}
