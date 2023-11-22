import { env } from "@config/env";
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

  constructor(atendimentoServiceConfig: Partial<AtendimentoServiceConfig>) {
    const config = { ...atendimentoDefaultConfig, ...atendimentoServiceConfig };
    this.isConnected = config.isConnected;
    this.localRepository = config.localRepository;
    this.remoteRepository = config.remoteRepository;
  }

  create = async (
    atendimentoInput: AtendimentoModel
  ): Promise<boolean | void> => {
    try {
      const atendimento = new Atendimento(atendimentoInput).toModel();

      if (!this.isConnected) {
        await this.localRepository.create(atendimento);
        console.log(
          "### App offline - saved atendimento locally.",
          atendimento
        );
        return;
      }
      await this.remoteRepository.create!(atendimento);
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:43: ", error);
      throw new Error(error.message);
    }
  };

  async getAtendimentos() {
    const atendimentos = await this.localRepository.findAll!();
    return atendimentos;
  }

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
}
