import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioDomainService } from "./RelatorioDomainService";
import relatorioModel from "_mockData/relatorio/relatorioModel.json";

const { outroExtensionista } = relatorioModel;
const ext = outroExtensionista[0];
const outrosExtensionistas = [
  { ...ext },
  { ...ext, id_usuario: "457", matricula_usuario: "457" },
  { ...ext, nome_usuario: "John Doe", id_und_empresa: "H0807" },
  {
    ...ext,
    id_usuario: "458",
    matricula_usuario: "458",
    nome_usuario: "Alice Doe",
    id_und_empresa: "H0808",
  },
];

describe("RelatorioDomainService", () => {
  describe("getOutrosExtensionistasIds", () => {
    it("returns a comma-separated string of ids", () => {
      const relatorio: Partial<RelatorioModel> = {
        outroExtensionista: outrosExtensionistas,
      };
      const expectedIds = "456,457,456,458";
      expect(
        RelatorioDomainService.getOutrosExtensionistasIds(relatorio)
      ).toEqual(expectedIds);
    });

    it("returns an empty string if outroExtensionista is undefined", () => {
      const relatorio: Partial<RelatorioModel> = {};
      expect(
        RelatorioDomainService.getOutrosExtensionistasIds(relatorio)
      ).toEqual("");
    });
  });
  it("should return the same string value if outroExtensionista is already a string", () => {
    const relatorio: any = { outroExtensionista: "237" };
    expect(
      RelatorioDomainService.getOutrosExtensionistasIds(relatorio)
    ).toEqual("237");
  });
  it("returns an empty string if outroExtensionista is already an empty string", () => {
    const relatorio: any = { outroExtensionista: "" };
    expect(
      RelatorioDomainService.getOutrosExtensionistasIds(relatorio)
    ).toEqual("");
  });
});

describe("RelatorioDomainService", () => {
  describe("getRelatoriosToUpdateOnServer", () => {
    const relatoriosLocal: Partial<RelatorioModel>[] = [
      {
        id: "1",
        assunto: "UPDATED!",
        pictureURI: "pictureURI1",
        assinaturaURI: "assinaturaURI1",
        updatedAt: "2022-01-02T00:00:00.000Z",
      },
      {
        id: "2",
        orientacao: "Nova orientação",
        pictureURI: "pictureURI23",
        assinaturaURI: "assinaturaURI23",
        updatedAt: "2022-01-03T00:00:00.000Z",
      },
    ];
    const outdatedOnServer = [
      {
        id: "1",
      },
      {
        id: "2",
        pictureURI: "oldPictureURI2",
        assinaturaURI: "oldAssinaturaURI2",
      },
    ];

    it("returns an array of relatorios that need to be updated on server", () => {
      const expected = [
        {
          id: "1",
          assunto: "UPDATED!",
          updatedAt: "2022-01-02T00:00:00.000Z",
        },
        {
          id: "2",
          orientacao: "Nova orientação",
          pictureURI: "pictureURI23",
          assinaturaURI: "assinaturaURI23",
          updatedAt: "2022-01-03T00:00:00.000Z",
        },
      ];

      expect(
        RelatorioDomainService.getDataToUpdateOnServer(
          relatoriosLocal,
          outdatedOnServer
        )
      ).toEqual(expected);
    });

    it("returns an empty array if there are no relatorios to update", () => {
      const expected: Partial<RelatorioModel>[] = [];

      expect(
        RelatorioDomainService.getDataToUpdateOnServer(relatoriosLocal, [])
      ).toEqual(expected);
    });
  });
});
