import { Repository } from "@domain/Repository";
import { UsuarioService } from "./UsuarioService";
import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";
import { Usuario } from "@shared/types/Usuario";

jest.mock("@infrastructure/api/usuario/UsuarioAPIRepository");
jest.mock("@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository");
jest.mock("@shared/utils/fileSystemUtils");

const mockUsuarioAPI = UsuarioAPIRepository as jest.Mocked<
  typeof UsuarioAPIRepository
>;
const mockLocalRepository =
  new UsuarioLocalStorageRepository() as jest.Mocked<UsuarioLocalStorageRepository>;

const localUsuarios: Usuario[] = [
  { id_usuario: "1", nome_usuario: "User 1", matricula_usuario: "123" },
  { id_usuario: "2", nome_usuario: "User 2", matricula_usuario: "456" },
  { id_usuario: "3", nome_usuario: "User 3", matricula_usuario: "789" },
];
const remoteUsuarios = localUsuarios;

const usuarioServiceTestConfig = {
  isConnected: false,
  localRepository: mockLocalRepository as Repository<Usuario>,
  remoteRepository: mockUsuarioAPI as UsuarioAPIRepository,
};

describe("UsuarioService", () => {
  let usuarioService: UsuarioService & any;

  beforeEach(() => {
    usuarioService = new UsuarioService(usuarioServiceTestConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsuariosByIds", () => {
    it("should return local usuarios when not connected", async () => {
      const ids = ["1", "2", "3"];
      mockLocalRepository.findMany.mockResolvedValue(localUsuarios);

      const result = await usuarioService.getUsuariosByIds(ids);

      expect(result).toEqual(localUsuarios);
      expect(mockLocalRepository.findMany).toHaveBeenCalledWith(ids);
      expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
    });

    it("should return local usuarios when online, but should not fetch from server", async () => {
      const ids = ["1", "2", "3"];
      mockLocalRepository.findMany.mockResolvedValue(localUsuarios);
      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      });

      const result = await usuarioService.getUsuariosByIds(ids);

      expect(result).toEqual(localUsuarios);
      expect(mockLocalRepository.findMany).toHaveBeenCalledWith(ids);
      expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
    });

    it("should fetch remote usuarios and save locally when should fetch from server", async () => {
      const ids = ["1", "2", "3"];
      mockLocalRepository.findMany.mockResolvedValue([]);
      mockUsuarioAPI.findMany.mockResolvedValue(remoteUsuarios);
      mockLocalRepository.create.mockResolvedValue(undefined);

      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      });
      const result = await usuarioService.getUsuariosByIds(ids);

      expect(result).toEqual(remoteUsuarios);
      expect(mockLocalRepository.findMany).toHaveBeenCalledWith(ids);
      expect(mockUsuarioAPI.findMany).toHaveBeenCalledWith({ ids: "1,2,3" });
      for (const usuario of remoteUsuarios) {
        expect(mockLocalRepository.create).toHaveBeenCalledWith(usuario);
      }
    });
  });

  describe("getUsuariosByMatriculas", () => {
    it("should return local usuarios when not connected", async () => {
      const matriculas = ["123", "456", "789"];
      mockLocalRepository.findAll.mockResolvedValue(localUsuarios);
      const saveLocalMock = jest.spyOn(usuarioService, "saveManyLocal");

      const result = await usuarioService.findMany({ matriculas });

      expect(result).toEqual(localUsuarios);
      expect(mockLocalRepository.findAll).toHaveBeenCalled();
      expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
      expect(saveLocalMock).not.toHaveBeenCalled();
    });

    it("should return local usuarios when online but found all usuarios in localStorage", async () => {
      const matriculas = ["123", "456", "789"];
      mockLocalRepository.findAll.mockResolvedValue(localUsuarios);
      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      }) as any;

      const saveLocalMock = jest.spyOn(usuarioService, "saveManyLocal");

      const result = await usuarioService.findMany({ matriculas });

      expect(result).toEqual(localUsuarios);
      expect(mockLocalRepository.findAll).toHaveBeenCalled();
      expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
      expect(saveLocalMock).not.toHaveBeenCalled();
    });

    it("should fetch remote usuarios and save locally when should fetch from server", async () => {
      const matriculas = ["123", "456", "789"];
      mockLocalRepository.findAll.mockResolvedValue([]);
      mockUsuarioAPI.findMany.mockResolvedValue(remoteUsuarios);
      mockLocalRepository.create.mockResolvedValue(undefined);

      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      });
      const result = await usuarioService.findMany({ matriculas });

      expect(result).toEqual(remoteUsuarios);
      expect(mockLocalRepository.findAll).toHaveBeenCalled();
      expect(mockUsuarioAPI.findMany).toHaveBeenCalledWith({
        matricula: "123,456,789",
      });
      for (const usuario of remoteUsuarios) {
        expect(mockLocalRepository.create).toHaveBeenCalledWith(usuario);
      }
    });

    it('should return empty array when "matriculas" is empty', async () => {
      const matriculas = [] as string[];
      mockLocalRepository.findAll.mockResolvedValue([]);
      mockUsuarioAPI.findMany.mockResolvedValue(remoteUsuarios);
      mockLocalRepository.create.mockResolvedValue(undefined);

      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      });
      const result = await usuarioService.findMany({ matriculas });

      expect(result).toEqual([]);
      expect(mockLocalRepository.findAll).not.toHaveBeenCalled();
      expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
    });

    it("should return empty array when not found in local nor remote repositories", async () => {
      const matriculas = ["123", "456", "789"];
      mockLocalRepository.findAll.mockResolvedValue([]);
      mockUsuarioAPI.findMany.mockResolvedValue([]);
      mockLocalRepository.create.mockResolvedValue(undefined);

      const usuarioService = new UsuarioService({
        ...usuarioServiceTestConfig,
        isConnected: true,
      });
      const result = await usuarioService.findMany({ matriculas });

      expect(result).toEqual([]);
      expect(mockLocalRepository.findAll).toHaveBeenCalled();
      expect(mockUsuarioAPI.findMany).toHaveBeenCalledWith({
        matricula: "123,456,789",
      });
      expect(mockLocalRepository.create).not.toHaveBeenCalled();
    });
  });
});

// import { Repository } from "@domain/Repository";
// import { UsuarioService } from "./UsuarioService";
// import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
// import { UsuarioLocalStorageRepository } from "@infrastructure/localStorage/usuario/UsuarioLocalStorageRepository";
// import { shouldSync } from "@services/system/systemUtils";
// import { Usuario } from "@shared/types/Usuario";

// jest.mock("@infrastructure/api/usuario/UsuarioAPIRepository");
// jest.mock("@shared/utils/dateUtils");

// const mockUsuarioAPI = UsuarioAPIRepository as jest.Mocked<typeof UsuarioAPIRepository>;
// const mockShouldSync = shouldSync as jest.MockedFunction<typeof shouldSync>;

// describe("UsuarioService", () => {
//   let usuarioService: UsuarioService;
//   let localRepository: Repository<Usuario>;

//   beforeEach(() => {
//     localRepository = new UsuarioLocalStorageRepository();
//     usuarioService = new UsuarioService(false, localRepository);
//   });

//   afterEach(async () => {
//     jest.clearAllMocks();
//   });

//   describe("getUsuariosByIds", () => {
//     it("should return local usuarios when not connected", async () => {
//       const ids = ["1", "2", "3"];
//       const localUsuarios = [
//         { id_usuario: "1", nome_usuario: "User 1", matricula_usuario: "123" },
//         { id_usuario: "2", nome_usuario: "User 2", matricula_usuario: "456" },
//       ];
//       jest.spyOn(localRepository, "findMany").mockResolvedValue(localUsuarios);

//       const result = await usuarioService.getUsuariosByIds(ids);

//       expect(result).toEqual(localUsuarios);
//       expect(localRepository.findMany).toHaveBeenCalledWith(ids);
//       expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
//       expect(mockShouldSync).not.toHaveBeenCalled();
//     });

//     it("should return local usuarios when should not fetch from server", async () => {
//       const ids = ["1", "2", "3"];
//       const localUsuarios = [
//         { id_usuario: "1", nome_usuario: "User 1", matricula_usuario: "123" },
//         { id_usuario: "2", nome_usuario: "User 2", matricula_usuario: "456" },
//         { id_usuario: "3", nome_usuario: "User 3", matricula_usuario: "789" },
//       ];
//       jest.spyOn(localRepository, "findMany").mockResolvedValue(localUsuarios);
//       jest.spyOn(mockShouldSync, "mockReturnValue").mockReturnValue(false);

//       const result = await usuarioService.getUsuariosByIds(ids);

//       expect(result).toEqual(localUsuarios);
//       expect(localRepository.findMany).toHaveBeenCalledWith(ids);
//       expect(mockUsuarioAPI.findMany).not.toHaveBeenCalled();
//       expect(mockShouldSync).toHaveBeenCalledWith(1000 * 60 * 60 * 24 * 5);
//     });

//     it("should fetch remote usuarios and save locally when should fetch from server", async () => {
//       const ids = ["1", "2", "3"];
//       const remoteUsuarios = [
//         { id_usuario: "1", nome_usuario: "User 1", matricula_usuario: "123" },
//         { id_usuario: "2", nome_usuario: "User 2", matricula_usuario: "456" },
//         { id_usuario: "3", nome_usuario: "User 3", matricula_usuario: "789" },
//       ];
//       jest.spyOn(mockUsuarioAPI, "findMany").mockResolvedValue(remoteUsuarios);
//       jest.spyOn(mockShouldSync, "mockReturnValue").mockReturnValue(true);

//       const result = await usuarioService.getUsuariosByIds(ids);

//       expect(result).toEqual(remoteUsuarios);
//       expect(localRepository.findMany).toHaveBeenCalledWith(ids);
//       expect(mockUsuarioAPI.findMany).toHaveBeenCalledWith({ ids: "1,2,3" });
//       expect(mockShouldSync).toHaveBeenCalledWith(1000 * 60 * 60 * 24 * 5);
//       expect(localRepository.create).toHaveBeenCalledTimes(3);
//       expect(localRepository.create).toHaveBeenCalledWith(remoteUsuarios[0]);
//       expect(localRepository.create).toHaveBeenCalledWith(remoteUsuarios[1]);
//       expect(localRepository.create).toHaveBeenCalledWith(remoteUsuarios[2]);
//     });
//   });
// });
