import { RelatorioModel } from "@features/relatorio/types";

export type CheckForUpdatesInputDto = {
  produtorIds: string[];
  relatoriosSyncInfo: Partial<RelatorioModel>[];
};
