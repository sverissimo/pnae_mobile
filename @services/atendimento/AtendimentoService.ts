import { AtendimentoRepository } from "@domain/atendimento/repository/AtendimentoRepository";
import {
  Atendimento,
  AtendimentoModel,
} from "@domain/atendimento/entity/Atendimento";
import { AtendimentoAPIRepository } from "@infrastructure/api";
import { AtendimentoLocalStorageRepository } from "@infrastructure/localStorage/atendimento/AtendimentoLocalStorageRepository";
import { env } from "@config/env";

const atendimentoAPI: AtendimentoRepository = new AtendimentoAPIRepository();
const atendimentoLocalRepo = new AtendimentoLocalStorageRepository();

export class AtendimentoService {
  constructor(
    private isConnected: boolean,
    private remoteRepository: AtendimentoRepository = atendimentoAPI,
    private localRepository: AtendimentoLocalStorageRepository = atendimentoLocalRepo
  ) {}

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
      await this.remoteRepository.create(atendimento.toDTO());

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
    await this.remoteRepository.create(atendimento);
    console.log("🚀 AtendimentoService ~ created atendimento remotely");
    await this.localRepository.delete(relatorioId);
  };
}
