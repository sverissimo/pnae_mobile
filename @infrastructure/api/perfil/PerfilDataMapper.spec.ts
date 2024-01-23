import { primeNumbersArray } from "./constants/primeNumbersArray";
import perfilOptions from "_mockData/perfil/perfilOptions.json";
import perfilInputDTO from "_mockData/perfil/perfilInput.json";
import perfilInput from "_mockData/perfil/perfil.json";
import createPerfilInput from "_mockData/perfil/createPerfilInput2.json";
import { PerfilModel } from "@domain/perfil";
import { PerfilDataMapper } from "./PerfilDataMapper";
import { log } from "@shared/utils/log";

const perfilDataMapper = new PerfilDataMapper(perfilOptions);

describe("PerfilDataMapper tests", () => {
  it("getPrimeNumbersProps should calculate the correct product of prime numbers for selected options", () => {
    const perfil = { ...perfilInput, ...perfilInputDTO } as PerfilModel;
    const perfilDataMapper = new PerfilDataMapper(perfilOptions);
    const result = perfilDataMapper.getPrimeNumbersProps(perfil, perfilOptions);

    const expectedAtividadesComRegularizacaoAmbiental =
      primeNumbersArray[2] * primeNumbersArray[1];

    const expectedProcedimentoPosColheita = 11 * 13;
    primeNumbersArray[2] * primeNumbersArray[1];

    const expectedAtividadesUsamRecursosHidricos = primeNumbersArray[2];
    const expectedCondicaoPosse = primeNumbersArray[3];

    const expectedDificuldadeFornecimentoNatura = 17;

    expect(result.atividades_com_regularizacao_ambiental).toBe(
      String(expectedAtividadesComRegularizacaoAmbiental)
    );
    expect(result.atividades_usam_recursos_hidricos).toBe(
      String(expectedAtividadesUsamRecursosHidricos)
    );
    expect(result.condicao_posse).toBe(String(expectedCondicaoPosse));
    expect(result.procedimento_pos_colheita).toBe(
      String(expectedProcedimentoPosColheita)
    );
    expect(result.dados_producao_in_natura.dificuldade_fornecimento).toBe(
      String(expectedDificuldadeFornecimentoNatura)
    );
  });
});
describe("PerfilDataMapper methods", () => {
  const perfilDTO = perfilDataMapper.toDTO(
    createPerfilInput as unknown as PerfilModel
  );
  console.log("🚀 - describe - perfilDTO:", JSON.stringify(perfilDTO));

  const prodNatura = perfilDTO.dados_producao_in_natura;
  const prodIndustria = perfilDTO.dados_producao_agro_industria;
  log({ prodNatura, prodIndustria });
  it("Should create a PerfilDTO when called Create Method", () => {
    expect(perfilDTO).toBeDefined();
    expect(perfilDTO).toHaveProperty("dados_producao_agro_industria");
    expect(perfilDTO).toHaveProperty("dados_producao_in_natura");
    expect(true).toBe(true);
  });

  it("Should convert grupos and produtos into nested arrays of objects", () => {
    expect(prodNatura).toHaveProperty("at_prf_see_grupos_produtos");
    expect(prodNatura.at_prf_see_grupos_produtos).toHaveLength(3);
    expect(prodNatura.at_prf_see_grupos_produtos[0]).toHaveProperty("id_grupo");
    expect(prodNatura.at_prf_see_grupos_produtos[0]).toHaveProperty(
      "at_prf_see_produto"
    );
    expect(
      prodNatura.at_prf_see_grupos_produtos[0].at_prf_see_produto[0]
    ).toHaveProperty("id_produto");
  });

  it("Should convert arrays of string to prime numbers", () => {
    expect(typeof perfilDTO.atividades_com_regularizacao_ambiental).toBe(
      "string"
    );
    expect(typeof perfilDTO.atividades_usam_recursos_hidricos).toBe("string");
    expect(typeof perfilDTO.condicao_posse).toBe("string");
    expect(typeof perfilDTO.procedimento_pos_colheita).toBe("string");
    expect(prodNatura.dificuldade_fornecimento).toBe("221");
    expect(prodIndustria.local_comercializacao).toBe("65");
  });

  it("Should convert stringsProps to boolean", () => {
    expect(typeof perfilDTO.possui_cadastro_car).toBe("boolean");
    expect(typeof perfilDTO.aderiu_pra).toBe("boolean");
    expect(typeof prodIndustria.controla_custos_producao).toBe("boolean");
    expect(typeof prodNatura.controla_custos_producao).toBe("boolean");
  });

  it("Should convert stringsProps to number", () => {
    expect(typeof perfilDTO.pessoas_processamento_alimentos).toBe("number");
    expect(typeof prodNatura.at_prf_see_grupos_produtos[0].area_utilizada).toBe(
      "number"
    );
    expect(
      typeof prodIndustria.at_prf_see_grupos_produtos[0].at_prf_see_produto[0]
        .area_utilizada
    ).toBe("number");
  });
  it("Should add dates to perfilDTO object", () => {
    const { data_atualizacao, data_preenchimento } = perfilDTO;
    expect(data_atualizacao).toBeDefined();
    expect(data_preenchimento).toBeDefined();
    expect(typeof data_atualizacao).toBe("string");
    expect(typeof data_preenchimento).toBe("string");
    expect(Date.parse(data_atualizacao)).toBeGreaterThan(0);
    expect(Date.parse(data_preenchimento)).toBeGreaterThan(0);
  });
});
