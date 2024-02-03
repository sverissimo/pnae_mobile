import { PerfilDataMapper } from "./PerfilDataMapper";
import { PerfilInputDTO } from "../dto/PerfilInputDTO";
import { primeNumbersArray } from "@infrastructure/api/perfil/constants/primeNumbersArray";
import perfilInputDTO from "_mockData/perfil/perfilInput.json";
import perfilInput from "_mockData/perfil/perfil.json";
import createPerfilInput from "_mockData/perfil/createPerfilInput2.json";
import createPerfilInputComplete from "_mockData/perfil/createPerfilInputComplete.json";
import perfilOptions from "_mockData/perfil/perfilOptions.json";

describe("PerfilDataMapper tests", () => {
  it("getPrimeNumbersProps should calculate the correct product of prime numbers for selected options", () => {
    const perfil = {
      ...perfilInput,
      ...perfilInputDTO,
    } as Partial<PerfilInputDTO>;
    const perfilDataMapper = new PerfilDataMapper(perfil, perfilOptions);
    const result = perfilDataMapper.getPrimeNumbersProps().build();

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

  describe("PerfilDataMapper modelToRemoteDTO method", () => {
    const perfilDataMapper = new PerfilDataMapper(
      createPerfilInput as Partial<PerfilInputDTO>,
      perfilOptions
    );

    const perfilModel = perfilDataMapper.perfilInputToModel();

    const perfilDTO = new PerfilDataMapper(
      perfilModel,
      perfilOptions
    ).modelToRemoteDTO();

    const prodNatura = perfilDTO.dados_producao_in_natura;
    const prodIndustria = perfilDTO.dados_producao_agro_industria;

    it("Should create a PerfilDTO when called Create Method", () => {
      expect(perfilDTO).toBeDefined();
      expect(perfilDTO).toHaveProperty("dados_producao_agro_industria");
      expect(perfilDTO).toHaveProperty("dados_producao_in_natura");
    });

    it("Should convert grupos and produtos into nested arrays of objects", () => {
      expect(prodNatura).toHaveProperty("at_prf_see_grupos_produtos");
      expect(prodNatura.at_prf_see_grupos_produtos).toHaveLength(3);
      expect(prodNatura.at_prf_see_grupos_produtos[0]).toHaveProperty(
        "id_grupo"
      );
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
      expect(
        typeof prodNatura.at_prf_see_grupos_produtos[0].area_utilizada
      ).toBe("number");
      expect(
        typeof prodIndustria.at_prf_see_grupos_produtos[0].at_prf_see_produto[0]
          .area_utilizada
      ).toBe("number");
    });
  });

  describe("PerfilDataMapper perfilInputToModel method", () => {
    const perfilDataMapper = new PerfilDataMapper(
      createPerfilInputComplete as PerfilInputDTO,
      perfilOptions
    );

    const perfilModel = perfilDataMapper.perfilInputToModel();
    const { dados_producao_agro_industria, dados_producao_in_natura } =
      perfilModel;
    const { at_prf_see_grupos_produtos: gruposNatura } =
      dados_producao_in_natura;
    const { at_prf_see_grupos_produtos: gruposIndustria } =
      dados_producao_agro_industria;

    it("Should convert nested arrays of objects to grupos and produtos", () => {
      expect(perfilModel.sistema_producao).toBe("Plantio direto, Orgânico");
      expect(perfilModel.condicao_posse).toBe("Aluguel");
      expect(perfilModel.procedimento_pos_colheita).toBe(
        "Armazenamento refrigerado"
      );

      expect(perfilModel.dados_producao_in_natura.forma_entrega_produtos).toBe(
        "Outros, Retirada na propriedade pelo cliente, Via associação, Via cooperativa"
      );
      expect(
        perfilModel.dados_producao_agro_industria.forma_entrega_produtos
      ).toBe("Via associação, Transportadora");
    });

    it("Should create dadosProducaoNatura and dadosProducaoIndustrial properties", () => {
      expect(perfilModel).toHaveProperty("dados_producao_agro_industria");
      expect(perfilModel).toHaveProperty("dados_producao_in_natura");
    });
    it("Should create at_prf_see_grupos_produtos and at_prf_see_produto properties", () => {
      expect(gruposNatura).toBeDefined();
      expect(gruposIndustria).toBeDefined();
      expect(gruposNatura).toHaveLength(2);
      expect(gruposIndustria).toHaveLength(2);
      expect(gruposNatura[0]).toHaveProperty("at_prf_see_produto");
      expect(gruposIndustria[0]).toHaveProperty("at_prf_see_produto");
    });

    it("at_prf_see_grupos_produtos should NOT have one EMPTY object at the end.", () => {
      expect(gruposNatura).toHaveLength(2);
      expect(gruposIndustria).toHaveLength(2);
      expect(gruposNatura.filter((g) => !g.nm_grupo)).toHaveLength(0);
      expect(gruposNatura.filter((g) => !!g.nm_grupo)).toHaveLength(2);
      expect(gruposIndustria.filter((g) => !g.nm_grupo)).toHaveLength(0);
      expect(gruposIndustria.filter((g) => !!g.nm_grupo)).toHaveLength(2);
    });
    it("at_prf_see_produto should NOT have ONE EMPTY object at the end.", () => {
      const grupoNatura = gruposNatura[0];
      const grupoIndustria = gruposIndustria[0];
      const { at_prf_see_produto: produtosNatura } = grupoNatura;
      const { at_prf_see_produto: produtosIndustria } = grupoIndustria;

      expect(produtosNatura).toHaveLength(4);
      expect(produtosIndustria).toHaveLength(1);
      expect(produtosNatura.filter((p) => !p.id_produto)).toHaveLength(0);
      expect(produtosNatura.filter((p) => !!p.id_produto)).toHaveLength(4);
      expect(produtosIndustria.filter((p) => !p.id_produto)).toHaveLength(0);
      expect(produtosIndustria.filter((p) => !!p.id_produto)).toHaveLength(1);
    });

    it("Should convert booleanProps to strings", () => {
      expect(typeof perfilModel.possui_cadastro_car).toBe("string");
      expect(typeof perfilModel.aderiu_pra).toBe("string");
      expect(
        typeof dados_producao_agro_industria.controla_custos_producao
      ).toBe("string");
      expect(typeof dados_producao_in_natura.controla_custos_producao).toBe(
        "string"
      );
    });
    it("Should add dates to perfilDTO object", () => {
      const { data_atualizacao, data_preenchimento } = perfilModel;
      expect(data_atualizacao).toBeDefined();
      expect(data_preenchimento).toBeDefined();
      expect(typeof data_atualizacao).toBe("string");
      expect(typeof data_preenchimento).toBe("string");
      expect(Date.parse(data_atualizacao)).toBeGreaterThan(0);
      expect(Date.parse(data_preenchimento)).toBeGreaterThan(0);
    });
  });
});
