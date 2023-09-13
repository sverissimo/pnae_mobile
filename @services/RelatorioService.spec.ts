import { describe, it } from "node:test";

import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";

describe("RelatorioService", () => {
  it("should be able to get users from one or more matriculas", async () => {
    const matriculas = ["08864", "10618", "08820"];

    const result = await UsuarioAPI.getUsuarios(matriculas);
    console.log("🚀 ~ file: RelatorioService.spec.ts:9 ~ it ~ result:", result);
  });
});
