import { AtendimentoRepository } from "@domain/atendimento/repository/AtendimentoRepository";
import { AtendimentoAPIRepository } from "@infrastructure/api";
import { AtendimentoLocalStorageRepository } from "@infrastructure/localStorage/atendimento/AtendimentoLocalStorageRepository";

export interface AtendimentoServiceConfig {
  isConnected: boolean;
  localRepository: AtendimentoRepository;
  remoteRepository: Partial<AtendimentoRepository>;
}

const localRepository = new AtendimentoLocalStorageRepository();
const remoteRepository = new AtendimentoAPIRepository();

export const atendimentoDefaultConfig = {
  isConnected: false,
  localRepository,
  remoteRepository,
};
