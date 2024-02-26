import { RelatorioSyncService } from "./RelatorioSyncService";
import { AtendimentoService } from "@services/atendimento/AtendimentoService";
import { RelatorioSQLRepository } from "@infrastructure/database/relatorio/repository/RelatorioSQLRepository";
import { ProdutorLocalStorageRepository } from "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository";
import atendimentoInput from "_mockData/createAtendimentoInput.json";
import relatorioInput from "_mockData/relatorio/createRelatorioInput.json";

jest.mock("@shared/utils/fileSystemUtils");
jest.mock("@infrastructure/database/config/expoSQLite");

jest.mock("@services/atendimento/AtendimentoService");
jest.mock("@infrastructure/api/relatorio/repository/RelatorioAPIRepository");
jest.mock(
  "@infrastructure/database/relatorio/repository/RelatorioSQLRepository"
);

jest.mock(
  "@infrastructure/localStorage/produtor/ProdutorLocalStorageRepository"
);

describe("RelatorioSyncService", () => {
  let relatorioSyncService: any;
  const db = jest.fn() as any;
  const relatorioLocalRepository = new RelatorioSQLRepository(db);
  const atendimentoService = new AtendimentoService();
  const relatorioRemoteRepository = {
    create: jest.fn(),
    update: jest.fn(),
    createMany: jest.fn(),
    updateMany: jest.fn(),
    findAll: jest.fn(),
    findByProdutorId: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  } as any;
  const syncURL = "http://localhost:3000/sync/relatorios";

  const produtorLocalRepository = new ProdutorLocalStorageRepository();

  beforeEach(() => {
    relatorioSyncService = new RelatorioSyncService({
      syncURL,
      atendimentoService,
      relatorioRemoteRepository,
      relatorioLocalRepository,
      produtorLocalRepository,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRelatorioRemote", () => {
    it("should create relatorio remotely and update local repository", async () => {
      const atendimento = atendimentoInput;
      const relatorio = relatorioInput;

      const atendimentoId = "1234";
      atendimentoService.create = jest.fn().mockResolvedValue(atendimentoId);
      atendimentoService.deleteAtendimentoLocal = jest.fn();
      atendimentoService.getAtendimentoLocal = jest
        .fn()
        .mockResolvedValue(atendimento);

      await relatorioSyncService.createRelatorioRemote(relatorio);

      expect(atendimentoService.getAtendimentoLocal).toHaveBeenCalledWith(
        relatorio.id
      );
      expect(atendimentoService.create).toHaveBeenCalledWith(atendimento);
      expect(relatorioRemoteRepository.create).toHaveBeenCalledWith({
        ...relatorio,
        atendimentoId,
      });
      expect(relatorioLocalRepository.update).toHaveBeenCalledWith({
        id: relatorio.id,
        atendimentoId,
      });
      expect(atendimentoService.deleteAtendimentoLocal).toHaveBeenCalledWith(
        relatorio.id
      );
    });
  });
});
