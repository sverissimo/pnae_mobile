import { PerfilDataMapper } from "./PerfilDataMapper";
import { PerfilInputDTO } from "../dto/PerfilInputDTO";
import createPerfilInput from "_mockData/perfil/createPerfilInput2.json";
import createPerfilInputComplete from "_mockData/perfil/createPerfilInputComplete.json";
import createPerfilInputWrong from "_mockData/perfil/createPerfilInputWrong.json";
import { PerfilDTO } from "@infrastructure/api/perfil/PerfilDTO";

describe("PerfilDataMapper tests", () => {
  describe("PerfilDataMapper modelToRemoteDTO method", () => {
    const perfilDataMapper = new PerfilDataMapper(
      createPerfilInput as Partial<PerfilInputDTO>
    );

    const perfilModel = perfilDataMapper.perfilInputToModel();

    const perfilDTO = new PerfilDataMapper(perfilModel).modelToRemoteDTO();

    const prodNatura = perfilDTO.dados_producao_in_natura;
    const prodIndustria = perfilDTO.dados_producao_agro_industria;

    it("Should create a PerfilDTO when called Create Method", () => {
      expect(perfilDTO).toBeDefined();
      expect(perfilDTO).toHaveProperty("dados_producao_agro_industria");
      expect(perfilDTO).toHaveProperty("dados_producao_in_natura");
    });

    it("Should convert grupos and produtos into nested arrays of objects", () => {
      const { at_prf_see_grupos_produtos } = prodNatura;

      expect(prodNatura).toHaveProperty("at_prf_see_grupos_produtos");
      expect(at_prf_see_grupos_produtos).toHaveLength(3);
      expect(at_prf_see_grupos_produtos[0]).toHaveProperty("id_grupo");
      expect(at_prf_see_grupos_produtos[0]).toHaveProperty(
        "at_prf_see_produto"
      );
      expect(
        at_prf_see_grupos_produtos[0].at_prf_see_produto[0]
      ).toHaveProperty("id_produto");
    });

    it("Should remove grupoNaturaOptions and dados_producao_natura if atividade === Secundaria", () => {
      const perfilDataMapper = new PerfilDataMapper(
        createPerfilInputWrong as any
      );

      const perfilModel = perfilDataMapper.perfilInputToModel() as any;
      const perfilDTO = new PerfilDataMapper(perfilModel).modelToRemoteDTO();

      expect(perfilDTO.dados_producao_in_natura).toBeUndefined();
      expect(perfilDTO.grupoNaturaOptions).toBeUndefined();
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
      createPerfilInputComplete as PerfilInputDTO
    );

    const perfilModel = perfilDataMapper.perfilInputToModel();
    const { dados_producao_agro_industria, dados_producao_in_natura } =
      perfilModel;
    const { at_prf_see_grupos_produtos: gruposNatura } =
      dados_producao_in_natura;
    const { at_prf_see_grupos_produtos: gruposIndustria } =
      dados_producao_agro_industria;

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

    it("Should remove grupoNaturaOptions and dados_producao_natura if atividade === Secundaria", () => {
      const perfilDataMapper = new PerfilDataMapper(
        createPerfilInputWrong as any
      );

      const perfilModel = perfilDataMapper.perfilInputToModel() as any;
      expect(perfilModel.dados_producao_in_natura).toBeUndefined();
    });

    it("Should create dados_producao_agro_industria if atividade === Secundária", () => {
      const perfilDataMapper = new PerfilDataMapper(
        createPerfilInputWrong as any
      );

      const perfilModel = perfilDataMapper.perfilInputToModel() as any;

      const { dados_producao_agro_industria } = perfilModel;
      const { at_prf_see_grupos_produtos } = dados_producao_agro_industria;

      expect(dados_producao_agro_industria).toBeDefined();
      expect(at_prf_see_grupos_produtos).toBeDefined();
      expect(at_prf_see_grupos_produtos).toHaveLength(2);
      expect(at_prf_see_grupos_produtos[0]).toHaveProperty(
        "at_prf_see_produto"
      );
      expect(
        at_prf_see_grupos_produtos[0].at_prf_see_produto[0].id_produto
      ).toBe("977");
    });

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

    it("Should remove wrong dadosProducao props from perfilInput object ", () => {
      const perfilDataMapper = new PerfilDataMapper(
        createPerfilInputWrong as any
      );

      const perfilModel = perfilDataMapper.perfilInputToModel() as any;
      const perfilDTO = new PerfilDataMapper(
        perfilModel
      ).modelToRemoteDTO() as PerfilDTO;

      expect(perfilDTO.condicao_posse).toBeUndefined();
      expect(perfilDTO.credito_rural).toBeUndefined();
      expect(perfilDTO.dap_caf_vigente).toBeUndefined();

      expect(perfilDTO.tipo_perfil).toBeDefined();
      expect(perfilDTO.participa_organizacao).toBeDefined();
      expect(perfilDTO.possui_agroindustria_propria).toBeDefined();
      expect(perfilDTO.tipo_estabelecimento).toBeDefined();
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
