import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioDomainService } from "./RelatorioDomainService";
import relatorioModel from "_mockData/relatorioModel.json";
const relatorios: RelatorioModel[] = [
  relatorioModel,
  {
    ...relatorioModel,
    id: "2",
    numeroRelatorio: 2,
    assunto: "Relatorio 2",
    orientacao: "Orientação 2",
    pictureURI: "pictureURI2",
  },
];
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
});

// describe("RelatorioDomainService", () => {
// it("should merge local and server relatorios and return updated relatorios", () => {
//   console.log("To be implemented...");
//   expect(true).toBeTruthy();
// });
//   describe("mergeRelatorios", () => {
//     it("should merge local and server relatorios and return updated relatorios", () => {

//   const relatoriosFromServer: RelatorioModel[] = [
//     {
//       id: "1",
//       nome: "Relatorio 1",
//       updatedAt: "2021-09-03T00:00:00.000Z",
//       readOnly: true,
//     },
//     {
//       id: "3",
//       nome: "Relatorio 3",
//       updatedAt: "2021-09-04T00:00:00.000Z",
//       readOnly: false,
//     },
//   ];

//   const updatedRelatorios = RelatorioDomainService.mergeRelatorios(
//     relatorios,
//     relatoriosFromServer
//   );

//   expect(updatedRelatorios).toEqual([
//     {
//       id: "1",
//       nome: "Relatorio 1",
//       updatedAt: "2021-09-03T00:00:00.000Z",
//       readOnly: true,
//     },
//     {
//       id: "2",
//       nome: "Relatorio 2",
//       updatedAt: "2021-09-02T00:00:00.000Z",
//       readOnly: true,
//     },
//     {
//       id: "3",
//       nome: "Relatorio 3",
//       updatedAt: "2021-09-04T00:00:00.000Z",
//       readOnly: false,
//     },
//   ]);
// });
//   });

//   describe("getOutrosExtensionistasNames", () => {
//     it("should return a comma-separated string of names of other extensionistas", () => {
//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//         outroExtensionista: [
//           { nome_usuario: "John Doe", matricula_usuario: "123" },
//           { nome_usuario: "Jane Doe", matricula_usuario: "456" },
//         ],
//       };

//       const nomes =
//         RelatorioDomainService.getOutrosExtensionistasNames(relatorio);

//       expect(nomes).toEqual("John Doe, Jane Doe");
//     });

//     it("should return an empty string if there are no other extensionistas", () => {
//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//       };

//       const nomes =
//         RelatorioDomainService.getOutrosExtensionistasNames(relatorio);

//       expect(nomes).toEqual("");
//     });
//   });

//   describe("getOutrosExtensionistasMatriculas", () => {
//     it("should return a comma-separated string of matriculas of other extensionistas", () => {
//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//         outroExtensionista: [
//           { nome_usuario: "John Doe", matricula_usuario: "123" },
//           { nome_usuario: "Jane Doe", matricula_usuario: "456" },
//         ],
//       };

//       const matriculas =
//         RelatorioDomainService.getOutrosExtensionistasMatriculas(relatorio);

//       expect(matriculas).toEqual("123, 456");
//     });

//     it("should return an empty string if there are no other extensionistas", () => {
//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//       };

//       const matriculas =
//         RelatorioDomainService.getOutrosExtensionistasMatriculas(relatorio);

//       expect(matriculas).toEqual("");
//     });
//   });

//   describe("getOutrosExtensionistasIds", () => {
//     it("should return a comma-separated string of ids of other extensionistas", () => {
//       const relatorio: Partial<RelatorioModel> = {
//         outroExtensionista: [
//           {
//             id_usuario: "1",
//             nome_usuario: "John Doe",
//             matricula_usuario: "123",
//           },
//           {
//             id_usuario: "2",
//             nome_usuario: "Jane Doe",
//             matricula_usuario: "456",
//           },
//         ],
//       };

//       const ids = RelatorioDomainService.getOutrosExtensionistasIds(relatorio);

//       expect(ids).toEqual("1,2");
//     });

//     it("should return an empty string if there are no other extensionistas", () => {
//       const relatorio: Partial<RelatorioModel> = {};

//       const ids = RelatorioDomainService.getOutrosExtensionistasIds(relatorio);

//       expect(ids).toEqual("");
//     });
//   });

//   describe("addTecnicos", () => {
//     it("should add nomeTecnico and other extensionistas info to relatorio", () => {
//       const tecnicos = [
//         { id_usuario: "1", nome_usuario: "John Doe", matricula_usuario: "123" },
//         { id_usuario: "2", nome_usuario: "Jane Doe", matricula_usuario: "456" },
//       ];

//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//         tecnicoId: "1",
//         outroExtensionista: [{ id_usuario: "2" }],
//       };

//       const updatedRelatorio = RelatorioDomainService.addTecnicos(
//         tecnicos,
//         relatorio
//       );

//       expect(updatedRelatorio).toEqual({
//         id: "1",
//         nome: "Relatorio 1",
//         tecnicoId: "1",
//         outroExtensionista: [{ id_usuario: "2" }],
//         nomeTecnico: "John Doe",
//         nomeOutroExtensionista: "Jane Doe,",
//         matriculaOutroExtensionista: "456,",
//       });
//     });

//     it("should return the same relatorio if there are no tecnicos or tecnicoId is not found", () => {
//       const tecnicos = [];

//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//         tecnicoId: "3",
//         outroExtensionista: [{ id_usuario: "2" }],
//       };

//       const updatedRelatorio = RelatorioDomainService.addTecnicos(
//         tecnicos,
//         relatorio
//       );

//       expect(updatedRelatorio).toEqual(relatorio);
//     });
//   });

//   describe("getTecnicosIdsFromRelatoriosList", () => {
//     it("should return an array of unique tecnicoIds from a list of relatorios", () => {
//       const relatoriosList: RelatorioModel[] = [
//         { id: "1", tecnicoId: "1", outroExtensionista: [{ id_usuario: "2" }] },
//         { id: "2", tecnicoId: "2", outroExtensionista: [{ id_usuario: "3" }] },
//         { id: "3", tecnicoId: "1", outroExtensionista: [{ id_usuario: "4" }] },
//       ];

//       const tecnicoIds =
//         RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatoriosList);

//       expect(tecnicoIds).toEqual(["1", "2"]);
//     });

//     it("should return an empty array if there are no tecnicoIds", () => {
//       const relatoriosList: RelatorioModel[] = [
//         { id: "1", outroExtensionista: [{ id_usuario: "2" }] },
//         { id: "2", outroExtensionista: [{ id_usuario: "3" }] },
//         { id: "3", outroExtensionista: [{ id_usuario: "4" }] },
//       ];

//       const tecnicoIds =
//         RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatoriosList);

//       expect(tecnicoIds).toEqual([]);
//     });
//   });

//   describe("aggregateOutroExtensionistaInfo", () => {
//     it("should return an object with nomeOutroExtensionista and matriculaOutroExtensionista", () => {
//       const tecnicos = [
//         { id_usuario: "1", nome_usuario: "John Doe", matricula_usuario: "123" },
//         { id_usuario: "2", nome_usuario: "Jane Doe", matricula_usuario: "456" },
//       ];

//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//         outroExtensionista: [{ id_usuario: "2" }],
//       };

//       const info = RelatorioDomainService.aggregateOutroExtensionistaInfo(
//         tecnicos,
//         relatorio
//       );

//       expect(info).toEqual({
//         nomeOutroExtensionista: "Jane Doe,",
//         matriculaOutroExtensionista: "456,",
//         outroExtensionista: [
//           {
//             id_usuario: "2",
//             nome_usuario: "Jane Doe",
//             matricula_usuario: "456",
//           },
//         ],
//       });
//     });

//     it("should return an object with empty strings if there are no other extensionistas", () => {
//       const tecnicos = [];

//       const relatorio: RelatorioModel = {
//         id: "1",
//         nome: "Relatorio 1",
//       };

//       const info = RelatorioDomainService.aggregateOutroExtensionistaInfo(
//         tecnicos,
//         relatorio
//       );

//       expect(info).toEqual({
//         nomeOutroExtensionista: "",
//         matriculaOutroExtensionista: "",
//         outroExtensionista: [],
//       });
//     });
//   });
// });
