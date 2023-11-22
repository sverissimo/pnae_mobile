import { ProdutorService, RelatorioService } from "../..";
import { SystemAPI } from "@infrastructure/api/@system/SystemAPI";

export interface RelatorioSyncConfig {
  produtorService: ProdutorService;
  relatorioService: RelatorioService;
  api: SystemAPI;
}

const api = new SystemAPI();
const relatorioService = new RelatorioService({ isConnected: true });
const produtorService = new ProdutorService({ isConnected: true });

export const defaultRelatorioSyncConfig = {
  api,
  produtorService,
  relatorioService,
};
