import { AtendimentoAPIRepository } from "@infrastructure/api";
import { AtendimentoService } from "./AtendimentoService";
import { AtendimentoRepository } from "@domain/atendimento";

import { env } from "@config/env";
import { AtendimentoLocalStorageRepository } from "@infrastructure/localStorage/atendimento/AtendimentoLocalStorageRepository";
import { AtendimentoServiceConfig } from "./AtendimentoServiceConfig";

jest.mock("@shared/utils/fileSystemUtils");

jest.mock(
  "@infrastructure/api/atendimento/repository/AtendimentoAPIRepository",
  () => {
    return {
      AtendimentoAPIRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
      })),
    };
  }
);

jest.mock(
  "@infrastructure/localStorage/atendimento/AtendimentoLocalStorageRepository",
  () => {
    return {
      AtendimentoLocalStorageRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        findByRelatorioId: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
      })),
    };
  }
);

const atendimentoInput = {
  id_usuario: "123",
  id_und_empresa: "123",
  id_pessoa_demeter: "123",
  id_pl_propriedade: "123",
  id_relatorio: "123",
};

const atendimentoDTO = {
  id_usuario: "123",
  id_und_empresa: "123",
  id_pessoa_demeter: "123",
  id_pl_propriedade: "123",
  link_pdf: `${env.SERVER_URL}/relatorios/pdf/123`,
};

const isConnected = true;
let atendimentoService: AtendimentoService;
let localRepository: AtendimentoRepository;
let remoteRepository: Partial<AtendimentoRepository>;
let atendimentoServiceTestConfig: AtendimentoServiceConfig;

describe("AtendimentoService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localRepository = new AtendimentoLocalStorageRepository();
    remoteRepository = new AtendimentoAPIRepository();

    atendimentoServiceTestConfig = {
      isConnected,
      localRepository,
      remoteRepository,
    };

    atendimentoService = new AtendimentoService(atendimentoServiceTestConfig);
  });
  describe("AtendimentoService 1st run", () => {
    describe("create atendimento method tests", () => {
      it("should create a atendimento remotely if online", async () => {
        await atendimentoService.create(atendimentoInput);
        expect(remoteRepository.create).toHaveBeenCalled();
      });
      it("should create a atendimento locally if offline", async () => {
        const offlineAtendimentoService = new AtendimentoService({
          ...atendimentoServiceTestConfig,
          isConnected: false,
        });
        await offlineAtendimentoService.create(atendimentoInput);
        expect(localRepository.create).toHaveBeenCalledWith(atendimentoInput);
      });
    });
    describe("uploadAtendimento method tests", () => {
      const relatorioId = "123";
      const atendimento = { ...atendimentoDTO, id_relatorio: relatorioId };

      it("should upload atendimento remotely and delete it locally", async () => {
        jest
          .spyOn(localRepository, "findByRelatorioId")
          .mockResolvedValue(atendimento);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);

        await atendimentoService.uploadAtendimento(relatorioId);

        expect(localRepository.findByRelatorioId).toHaveBeenCalledWith(
          relatorioId
        );
        expect(remoteRepository.create).toHaveBeenCalledWith(atendimento);
        expect(localRepository.delete).toHaveBeenCalledWith(relatorioId);
      });

      it("should not upload atendimento if it does not exist locally", async () => {
        jest
          .spyOn(localRepository, "findByRelatorioId")
          .mockResolvedValue(null);
        jest.spyOn(remoteRepository, "create").mockResolvedValue(undefined);
        jest.spyOn(localRepository, "delete").mockResolvedValue(undefined);

        await atendimentoService.uploadAtendimento(relatorioId);

        expect(localRepository.findByRelatorioId).toHaveBeenCalledWith(
          relatorioId
        );
        expect(remoteRepository.create).not.toHaveBeenCalled();
        expect(localRepository.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe("AtendimentoService 2nd run", () => {
    describe("create method tests", () => {
      it("should create an atendimento remotely when online", async () => {
        const result = await atendimentoService.create(atendimentoInput);

        expect(localRepository.create).not.toHaveBeenCalled();
        expect(remoteRepository.create).toHaveBeenCalledWith(atendimentoInput);
        expect(result).toBeUndefined();
      });

      it("should store an atendimento locally when offline", async () => {
        atendimentoService = new AtendimentoService({
          isConnected: false,
          localRepository: localRepository,
          remoteRepository: remoteRepository,
        });

        await atendimentoService.create(atendimentoInput);

        expect(localRepository.create).toHaveBeenCalledWith(atendimentoInput);
        expect(remoteRepository.create).not.toHaveBeenCalled();
      });
    });

    describe("findAll method tests", () => {
      it("should retrieve all atendimentos from local repository", async () => {
        localRepository.findAll = jest
          .fn()
          .mockResolvedValue([atendimentoInput]);

        const result = await atendimentoService.getAtendimentos();

        expect(localRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual([atendimentoInput]);
      });
    });
  });
});
