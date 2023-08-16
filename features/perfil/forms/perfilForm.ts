import { FormElement } from "../../../@shared/types/FormElement";

export const perfilForm: FormElement[] = [
  {
    field: "tipo_perfil",
    label: "Tipo de Perfil",
    type: "select",
    options: ["ENTRADA", "SAÍDA"],
  },
  {
    field: "participa_organizacao",
    label: "Participa de Organização",
    type: "radio",
  },
  {
    field: "grau_interesse_pnae",
    label: "Grau interesse PNAE",
    type: "select",
    options: ["BAIXO", "MÉDIO", "ALTO"],
  },
  {
    field: "atvidade",
    label: "Atividade Desenvolvida",
    type: "select",
    options: ["ATIVIDADE_PRIMARIA", "ATIVIDADE_SECUNDARIA", "AMBAS"],
  },
  {
    field: "nivel_tecnologico_cultivo",
    label: "Nível Tecnológico de Cultivo",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "sistema_producao",
    label: "Sistema de Produção",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "condicao_posse",
    label: "Condição de Posse",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "dap_caf_vigente",
    label: "DAP/CAF Vigente",
    type: "radio",
  },
  {
    field: "credito_rural",
    label: "Crédito Rural",
    type: "radio",
  },
  {
    field: "fonte_captacao_agua",
    label: "Fonte de Captação de Água",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "forma_esgotamento_sanitario",
    label: "Forma de Esgotamento Sanitário",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "possui_cadastro_car",
    label: "Possui Cadastro CAR",
    type: "radio",
  },
  {
    field: "aderiu_pra",
    label: "Aderiu ao PRA",
    type: "radio",
  },
  {
    field: "ciente_iniciativas_regularizacao_pra",
    label: "Ciente das Iniciativas de Regularização PRA",
    type: "radio",
  },
  {
    field: "realiza_escalonamento_producao",
    label: "Realiza Escalonamento de Produção",
    type: "radio",
  },
  {
    field: "procedimento_pos_colheita",
    label: "Procedimento Pós-Colheita",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "possui_agroindustria_propria",
    label: "Possui Agroindústria Própria",
    type: "radio",
  },
  {
    field: "tipo_gestao_unidade",
    label: "Tipo de Gestão da Unidade",
    type: "select",
    options: ["FAMILIAR", "COLETIVA"],
  },
  {
    field: "pessoas_processamento_alimentos",
    label: "Pessoas no Processamento de Alimentos",
    type: "input",
  },
  {
    field: "tipo_estabelecimento",
    label: "Tipo de Estabelecimento",
    type: "select",
    options: ["PF", "PJ"],
  },
  {
    field: "tipo_pessoa_juridica",
    label: "Tipo de Pessoa Jurídica",
    type: "select",
    options: ["ASSOCIAÇÃO", "COOPERATIVA", "MEI", "OUTROS"],
  },
  {
    field: "agroindustria_precisa_adaptacao_reforma",
    label: "Agroindústria Precisa de Adaptação/Reforma",
    type: "radio",
  },
  {
    field: "possui_registro_orgao_fiscalizacao_sanitaria",
    label: "Possui Registro em Órgão de Fiscalização Sanitária",
    type: "radio",
  },
  {
    field: "orgao_fiscalizacao_sanitaria",
    label: "Órgão de Fiscalização Sanitária",
    type: "select",
    options: ["IMA", "MAPA", "SIM", "VIGILANCIA_SANITARIA", "NAO_SE_APLICA"],
  },
  {
    field: "atividades_usam_recursos_hidricos",
    label: "Atividades que Usam Recursos Hídricos",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "atividades_com_regularizacao_ambiental",
    label: "Atividades com Regularização Ambiental",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },

  //************* DADOS DE PRODUÇÃO *********** */
  {
    field: "controla_custos_producao",
    label: "Controla Custos de Produção",
    type: "radio",
  },
  {
    field: "tipo_regularizacao_uso_recursos_hidricos",
    label: "Tipo de Regularização do Uso de Recursos Hídricos",
    type: "select",
    options: ["CERTIDAO_USO_INSIGNIFICANTE", "OUTORGA", "NAO_POSSUI"],
  },

  {
    field: "valor_total_obtido_pnae",
    label: "Valor Total Obtido PNAE",
    type: "input",
  },

  {
    field: "valor_total_obtido_outros",
    label: "Valor Total Obtido de Outros",
    type: "input",
  },
  {
    field: "local_comercializacao",
    label: "Local de Comercialização",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "forma_entrega_produtos",
    label: "Forma de Entrega dos Produtos",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },
  {
    field: "dificuldade_fornecimento",
    label: "Dificuldade de Fornecimento",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
  },

  {
    field: "informacoes_adicionais",
    label: "Informações Adicionais",
    type: "input",
  },

  {
    //14TH IN THE EXCEL FORM
    field: "tipo_regularizacao_ambiental",
    label: "Tipo de Regularização Ambiental",
    type: "select",
    options: [
      "CERTIDAO_DISPENSA_LICENCIAMENTO",
      "LICENCA_AMBIENTAL",
      "NAO_POSSUI",
    ],
  },
];
