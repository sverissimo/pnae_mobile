import { FormElement } from "../../../@shared/types/FormElement";

export const producaoIndustrialForm: FormElement[] = [
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
    field: "controla_custos_producao",
    label: "Controla Custos de Produção",
    type: "radio",
  },
  {
    field: "realiza_escalonamento_producao",
    label: "Realiza Escalonamento de Produção",
    type: "radio",
  },
  {
    field: "local_comercializacao",
    label: "Local de Comercialização",
    type: "select",
    options: ["OPÇÃO1", "OPÇÃO2"],
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
];
