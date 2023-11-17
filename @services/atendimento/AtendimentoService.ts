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
    atendimentoInput: Omit<AtendimentoModel, "link_pdf">
  ): Promise<boolean | void> => {
    try {
      const atendimento = new Atendimento(atendimentoInput);
      atendimento.addPDFLink(env.SERVER_URL);

      if (!this.isConnected) {
        await this.localRepository.create(atendimento.toModel());
        console.log(
          "### App offline - saved atendimento locally.",
          atendimento.toModel()
        );
        return true;
      }
      await this.remoteRepository.create!(atendimento.toDTO());

      return true;
    } catch (error: any) {
      console.log("🚀 RelatorioService.ts:31: ", error);
      throw new Error(error.message);
    }
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
}
