import { SQLiteRepository } from "@infrastructure/database/SQLiteRepository";
import { RelatorioDB } from "./RelatorioDB";
import { RelatorioModel } from "@features/relatorio/types";

describe("RelatorioDB", () => {
  let entityManager: SQLiteRepository<RelatorioModel>;
  let relatorioDB: RelatorioDB | any;

  beforeEach(() => {
    entityManager = new SQLiteRepository<RelatorioModel>("relatorio", "id");
    relatorioDB = new RelatorioDB();
  });

  describe("findByProdutorID", () => {
    it("should return an array of RelatorioModel", async () => {
      // Arrange
      const produtorId = "1707715";

      // Act
      const result = await relatorioDB.findByProdutorID(produtorId);
      console.log("🚀 ~ file: RelatorioDB.test.ts:21 ~ it ~ result:", result);

      // Assert
      expect(entityManager.find).toHaveBeenCalledWith(
        "SELECT * FROM relatorio WHERE produtor_id = ?;",
        [produtorId]
      );

      expect(relatorioDB.camelizeRelatorio).toHaveBeenCalled();
      expect(
        result.every((r: RelatorioModel) => Object.hasOwn(r, "produtorId"))
      ).toBeTruthy();
      expect(
        result.every((r: RelatorioModel) => Object.hasOwn(r, "assinaturaURI"))
      ).toBeTruthy();
      expect(
        result.every(
          (r: RelatorioModel) => new Date(r.createdAt) instanceof Date
        )
      ).toBeTruthy();
    });
  });
  //   describe("findByProdutorID", () => {
  //       it("should return an array of RelatorioModel", async () => {
  //         // Arrange
  //         const produtorId = "1707715";
  //         const relatorioLocalDTO = { id: 1, produtor_id: produtorId };
  //         const expectedRelatorioModel = { id: 1, produtorId };
  //         entityManager.find = jest.fn().mockResolvedValue([relatorioLocalDTO]);

  //         // Act
  //         const result = await relatorioDB.findByProdutorID(produtorId);

  //         // Assert
  //         expect(entityManager.find).toHaveBeenCalledWith(
  //           "SELECT * FROM relatorio WHERE produtor_id = ?;",
  //           [produtorId]
  //         );
  //         expect(relatorioDB.camelizeRelatorio).toHaveBeenCalledWith(
  //           relatorioLocalDTO
  //         );
  //         expect(result).toEqual([expectedRelatorioModel]);
  //       });
  //     });
});
