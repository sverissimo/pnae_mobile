import { RelatorioRepository } from "@domain/relatorio";
import { RelatorioAPIRepository } from "@infrastructure/api";
import { db } from "@infrastructure/database/config/expoSQLite";
import { RelatorioExpoSQLDAO } from "@infrastructure/database/relatorio/dao/RelatorioExpoSQLDAO";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { UsuarioService } from "@services/usuario/UsuarioService";

export interface RelatorioServiceConfig {
  isConnected: boolean;
  usuarioService: UsuarioService;
  localRepository: RelatorioRepository;
  remoteRepository: RelatorioRepository;
}

const relatorioAPI: RelatorioRepository = new RelatorioAPIRepository();
const relatorioDAO = new RelatorioExpoSQLDAO(db);
const relatorioExpoSQLRepository = new RelatorioSQLRepository(relatorioDAO);
const usuarioService = new UsuarioService();

export const defaultConfig = {
  isConnected: false,
  localRepository: relatorioExpoSQLRepository,
  remoteRepository: relatorioAPI,
  usuarioService,
};
