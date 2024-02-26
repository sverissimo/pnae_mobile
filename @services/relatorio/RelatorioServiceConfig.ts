import { RelatorioRepository } from "@domain/relatorio";
import { RelatorioAPIRepository } from "@infrastructure/api";
import { db } from "@infrastructure/database/config/expoSQLite";
import { RelatorioExpoSQLDAO } from "@infrastructure/database/relatorio/dao/RelatorioExpoSQLDAO";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { AtendimentoService } from "@services/atendimento/AtendimentoService";
import { UsuarioService } from "@services/usuario/UsuarioService";
import { RelatorioSyncService } from "@sync/relatorio/RelatorioSyncService";

export interface RelatorioServiceConfig {
  isConnected: boolean;
  localRepository: RelatorioRepository;
  remoteRepository: RelatorioRepository;
  atendimentoService?: AtendimentoService;
  syncService: RelatorioSyncService;
  usuarioService: UsuarioService;
}

const relatorioAPI: RelatorioRepository = new RelatorioAPIRepository();
const relatorioDAO = new RelatorioExpoSQLDAO(db);
const relatorioExpoSQLRepository = new RelatorioSQLRepository(relatorioDAO);
const atendimentoService = new AtendimentoService();
const usuarioService = new UsuarioService();
const syncService = new RelatorioSyncService();

export const defaultConfig = {
  isConnected: false,
  localRepository: relatorioExpoSQLRepository,
  remoteRepository: relatorioAPI,
  atendimentoService,
  syncService,
  usuarioService,
};
