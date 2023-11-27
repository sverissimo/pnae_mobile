import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import { Repository } from "@domain/Repository";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { RelatorioRepository } from "@domain/relatorio";
import { RelatorioAPIRepository } from "@infrastructure/api";
import { RelatorioExpoSQLDAO } from "@infrastructure/database/relatorio/dao/RelatorioExpoSQLDAO";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { env } from "@config/env";

export interface RelatorioSyncConfig {
  syncURL: string;
  produtorLocalRepository: Repository<ProdutorModel>;
  relatorioLocalRepository: RelatorioRepository;
  relatorioRemoteRepository: RelatorioRepository;
}

const syncURL = `${env.SERVER_URL}/sync/relatorios`;
const relatorioDAO = new RelatorioExpoSQLDAO();
const relatorioLocalRepository = new RelatorioSQLRepository(relatorioDAO);
const relatorioRemoteRepository = new RelatorioAPIRepository();
const produtorLocalRepository = new ProdutorLocalStorageRepository();

export const defaultRelatorioSyncConfig = {
  syncURL,
  produtorLocalRepository,
  relatorioLocalRepository,
  relatorioRemoteRepository,
};
