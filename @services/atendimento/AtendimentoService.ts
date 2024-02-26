import { AtendimentoRepository } from "@domain/atendimento/repository/AtendimentoRepository";
import {
  Atendimento,
  AtendimentoModel,
} from "@domain/atendimento/entity/Atendimento";
import {
  AtendimentoServiceConfig,
  atendimentoDefaultConfig,
} from "./AtendimentoServiceConfig";

export class AtendimentoService {
  private isConnected: boolean;
  private localRepository: AtendimentoRepository;
  private remoteRepository: Partial<AtendimentoRepository>;

  constructor(atendimentoServiceConfig?: Partial<AtendimentoServiceConfig>) {
    const config = { ...atendimentoDefaultConfig, ...atendimentoServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
  }

  setConnectionStatus(value: boolean) {
    this.isConnected = value;
  }

  create = async (
    atendimentoInput: AtendimentoModel
  ): Promise<string | undefined> => {
    try {
      const atendimento = new Atendimento(atendimentoInput).toModel();

      if (!this.isConnected) {
        await this.localRepository.create(atendimento);
        console.log("@@@ App offline, saved atendimento locally.", atendimento);
        return;
      }

      const atendimentoId = await this.remoteRepository.create!(atendimento);
      console.log("🚀 - AtendimentoService - atendimentoId:", atendimentoId);

      return atendimentoId as unknown as string;
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:43: ", error);
      throw new Error(error.message);
    }
  };

  getAtendimentoLocal = async (relatorioId: string) => {
    const atendimento = await this.localRepository.findByRelatorioId(
      relatorioId
    );
    return atendimento;
  };

  getAtendimentos = async () => {
    const atendimentos = await this.localRepository.findAll!();
    return atendimentos;
  };

  uploadAtendimento = async (relatorioId: string) => {
    const atendimento = await this.localRepository.findByRelatorioId(
      relatorioId
    );
    if (!atendimento) {
      return;
    }

    await this.remoteRepository.create!(atendimento);
    console.log("🚀 AtendimentoService ~ created atendimento remotely");
    await this.localRepository.delete(relatorioId);
  };

  deleteAtendimentoLocal = async (relatorioId: string) => {
    try {
      await this.localRepository.delete(relatorioId);
    } catch (error) {
      throw error;
    }
  };

  // sync = async () => {
  //   const atendimentos = await this.localRepository.findAll!();

  //   if (atendimentos.length === 0) {
  //     console.log("@@@ No atendimentos to sync");
  //     return;
  //   }

  //   for (const atendimento of atendimentos) {
  //     try {
  //       const atendimentoId = await this.remoteRepository.create!(atendimento);
  //       await this.localRepository.delete(atendimento.id_relatorio);
  //     } catch (error) {
  //       console.log("🚀 AtendimentoService.ts:74 - sync error: ", error);
  //       continue;
  //     }
  //     console.log(`### synced ${atendimentos.length} atendimentos`);
  //   }
  // };
}
