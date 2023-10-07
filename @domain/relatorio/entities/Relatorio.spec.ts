import { RelatorioLocalDTO } from "@infrastructure/database/dto";
import { Relatorio } from "./Relatorio";
import { Usuario } from "@shared/types";

const relatorio = {
  id: "1",
  produtorId: "123",
  tecnicoId: "456",
  numeroRelatorio: 1,
  assunto: "assunto",
  orientacao: "orientacao",
  nomeTecnico: "nomeTecnico",
  pictureURI: "pictureURI",
  assinaturaURI: "assinaturaURI",
  outroExtensionista: [
    {
      id_usuario: "789",
      nome_usuario: "nomeOutroExtensionista",
      matricula_usuario: "matriculaOutroExtensionista",
      password: "password",
      perfis: ["admin", "user"],
    },
  ],
  nomeOutroExtensionista: "nomeOutroExtensionista",
  createdAt: "createdAt",
};

describe("Relatorio", () => {
  describe("constructor", () => {
    it("should throw an error if produtorId is not provided", () => {
      expect(() => new Relatorio({ ...relatorio, produtorId: "" })).toThrow(
        "Produtor não pode ser vazio"
      );
    });

    it("should throw an error if tecnicoId is not provided", () => {
      expect(() => new Relatorio({ ...relatorio, tecnicoId: "" })).toThrow(
        "Técnico não pode ser vazio"
      );
    });

    it("should throw an error if numeroRelatorio is not between 1 and 999", () => {
      expect(() => new Relatorio({ ...relatorio, numeroRelatorio: 0 })).toThrow(
        "Número do relatório inválido"
      );
      expect(
        () => new Relatorio({ ...relatorio, numeroRelatorio: 1000 })
      ).toThrow("Número do relatório inválido");
    });
  });

  describe("toLocalDTO", () => {
    it("should return a decamelized RelatorioLocalDTO object", () => {
      const localDTO = new Relatorio(relatorio).toLocalDTO();
      expect(localDTO).toEqual({
        id: "1",
        produtor_id: "123",
        tecnico_id: "456",
        numero_relatorio: 1,
        assunto: "assunto",
        orientacao: "orientacao",
        picture_uri: "pictureURI",
        assinatura_uri: "assinaturaURI",
        outro_extensionista: "789",
        created_at: "createdAt",
      });
    });
  });

  describe("toDTO", () => {
    it("should return a camelized RelatorioBackendDTO object", () => {
      const dto = new Relatorio(relatorio).toDTO();
      expect(dto.numeroRelatorio).toBe(1);
      expect(typeof dto.outroExtensionista === "string").toBeTruthy;
    });
  });

  describe("addTecnicos", () => {
    const tecnicos: Usuario[] = [
      {
        id_usuario: "1",
        matricula_usuario: "12345",
        nome_usuario: "John Doe",
        password: "password123",
        perfis: ["admin", "user"],
      },
      {
        id_usuario: "2",
        matricula_usuario: "67890",
        nome_usuario: "Jane Smith",
        password: "password456",
        perfis: ["user"],
      },
    ];

    it("should return a new RelatorioModel object with the nomeTecnico and outrosExtensionistasInfo properties added", () => {
      const newRelatorio = new Relatorio(relatorio).addTecnicos(tecnicos);
      expect(newRelatorio).toHaveProperty("nomeTecnico");
      expect(newRelatorio).toHaveProperty("matriculaOutroExtensionista");
      expect(newRelatorio).toHaveProperty("nomeOutroExtensionista");
      // expect(newRelatorio.matriculaOutroExtensionista).toBe(
      //   "matriculaOutroExtensionista"
      // );
      // expect(newRelatorio.nomeOutroExtensionista).toBe(
      //   "nomeOutroExtensionista"
      // );
    });
  });

  describe("static toModel", () => {
    it("should return a camelized RelatorioModel object", () => {
      const localDTO: RelatorioLocalDTO = {
        id: "1",
        produtor_id: "123",
        tecnico_id: "456",
        numero_relatorio: 1,
        assunto: "Assunto do relatório",
        orientacao: "Orientação do relatório",
        picture_uri: "https://example.com/picture.jpg",
        assinatura_uri: "https://example.com/assinatura.jpg",
        outro_extensionista: "Nome do outro extensionista",
        read_only: true,
        coordenadas: "123.456,789.012",
        created_at: new Date(),
        updated_at: new Date(),
      };
      const model = Relatorio.toModel(localDTO);
      expect(model).toHaveProperty("produtorId");
      expect(model).toHaveProperty("tecnicoId");
      expect(model).toHaveProperty("numeroRelatorio");
      expect(model).toHaveProperty("assunto");
      expect(model).toHaveProperty("orientacao");
      expect(model).toHaveProperty("pictureURI");
      expect(model).toHaveProperty("assinaturaURI");
      expect(model).toHaveProperty("outroExtensionista");
      expect(model).toHaveProperty("readOnly");
      expect(model).toHaveProperty("coordenadas");
      expect(model).toHaveProperty("createdAt");
    });
  });
});
