import { FormElement } from "../../../@shared/types/FormElement";

export const producaoIndustrialForm: FormElement[] = [
  {
    field: "possui_agroindustria_propria",
    label: "Possui Agroindústria Própria",
    type: "radio",
    key: "possui_agroindustria_propria2",
  },
  {
    field: "tipo_gestao_unidade",
    label: "Tipo de Gestão da Unidade",
    type: "select",
    options: ["FAMILIAR", "COLETIVA"],
    key: "tipo_gestao_unidade2",
  },
  {
    field: "pessoas_processamento_alimentos",
    label: "Pessoas no Processamento de Alimentos",
    type: "input",
    key: "pessoas_processamento_alimentos2",
  },
  {
    field: "tipo_estabelecimento",
    label: "Tipo de Estabelecimento",
    type: "select",
    options: ["PF", "PJ"],
    key: "tipo_estabelecimento2",
  },
  {
    field: "tipo_pessoa_juridica",
    label: "Tipo de Pessoa Jurídica",
    type: "select",
    options: ["ASSOCIAÇÃO", "COOPERATIVA", "MEI", "OUTROS"],
    key: "tipo_pessoa_juridica2",
  },
  {
    field: "agroindustria_precisa_adaptacao_reforma",
    label: "Agroindústria Precisa de Adaptação/Reforma",
    type: "radio",
    key: "agroindustria_precisa_adaptacao_reforma2",
  },
  {
    field: "possui_registro_orgao_fiscalizacao_sanitaria",
    label: "Possui Registro em Órgão de Fiscalização Sanitária",
    type: "radio",
    key: "possui_registro_orgao_fiscalizacao_sanitaria2",
  },
  {
    field: "orgao_fiscalizacao_sanitaria",
    label: "Órgão de Fiscalização Sanitária",
    type: "select",
    options: ["IMA", "MAPA", "SIM", "VIGILANCIA_SANITARIA", "NAO_SE_APLICA"],
    key: "orgao_fiscalizacao_sanitaria2",
  },
  {
    field: "controla_custos_producao",
    label: "Controla Custos de Produção",
    type: "radio",
    key: "controla_custos_producao2",
  },
  {
    field: "realiza_escalonamento_producao",
    label: "Realiza Escalonamento de Produção",
    type: "radio",
    key: "realiza_escalonamento_producao2",
  },
  {
    field: "local_comercializacao",
    label: "Local de Comercialização",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
    key: "local_comercializacao2",
  },
  {
    field: "valor_total_obtido_pnae",
    label: "Valor Total Obtido PNAE",
    type: "input",
    key: "valor_total_obtido_pnae2",
  },
  {
    field: "valor_total_obtido_outros",
    label: "Valor Total Obtido de Outros",
    type: "input",
    key: "valor_total_obtido_outros2",
  },
  {
    field: "forma_entrega_produtos",
    label: "Forma de Entrega dos Produtos",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
    key: "forma_entrega_produtos2",
  },
  {
    field: "dificuldade_fornecimento",
    label: "Dificuldade de Fornecimento",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
    key: "dificuldade_fornecimento2",
  },
  {
    field: "informacoes_adicionais",
    label: "Informações Adicionais",
    type: "input",
    key: "informacoes_adicionais2",
  },
];
