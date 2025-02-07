import { FormElement } from "../../../@shared/types/FormElement";

export const producaoIndustrialFormContrato1: FormElement[] = [
  {
    field: "gruposIndustrialOptions",
    label: "Grupos de Produtos da Agroindústria",
    type: "navigateToScreen",
    options: [],
  },
  {
    field: "possui_agroindustria_propria",
    label: "Possui Agroindústria Própria",
    type: "radio",
    key: "possui_agroindustria_propria",
  },
  {
    field: "tipo_gestao_unidade",
    label: "Tipo de Gestão da Unidade",
    type: "select",
    options: [],
  },
  {
    field: "pessoas_processamento_alimentos",
    label: "Pessoas no Processamento de Alimentos",
    type: "input",
    keyboardType: "numeric",
  },
  {
    field: "tipo_estabelecimento",
    label: "Tipo de Estabelecimento",
    type: "select",
    options: [],
  },
  {
    field: "tipo_pessoa_juridica",
    label: "Tipo de Pessoa Jurídica",
    type: "select",
    options: [],
    key: "tipo_pessoa_juridica2",
    dependsOn: "tipo_estabelecimento",
    dependsOnValues: ["Pessoa Jurídica"],
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
    options: [],
    dependsOn: "possui_registro_orgao_fiscalizacao_sanitaria",
    dependsOnValues: ["true"],
  },
  {
    field: "controla_custos_producao2",
    label: "Controla Custos de Produção",
    type: "radio",
    key: "controla_custos_producao2",
  },
  {
    field: "tipo_regularizacao_ambiental2",
    label: "Tipo de Regularização Ambiental",
    type: "select",
    options: [],
  },
  {
    field: "tipo_regularizacao_uso_recursos_hidricos2",
    label: "Tipo de Regularização do Uso de Recursos Hídricos",
    type: "select",
    options: [],
  },
  {
    field: "valor_total_obtido_pnae2",
    label: "Valor Total Obtido PNAE",
    type: "select",
    options: [],
  },
  {
    field: "valor_total_obtido_outros2",
    label: "Valor Total Obtido de Outros",
    type: "select",
    options: [],
  },
  {
    field: "local_comercializacao2",
    label: "Local de Comercialização",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "forma_entrega_produtos2",
    label: "Forma de Entrega dos Produtos",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "dificuldade_fornecimento2",
    label: "Dificuldade de Fornecimento",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "informacoes_adicionais2",
    label: "Informações Adicionais",
    type: "input",
    multiline: true,
    numberOfLines: 4,
  },
];

export const producaoIndustrialViewForm =
  producaoIndustrialFormContrato1.filter(
    ({ field }) => field !== "gruposIndustrialOptions"
  );
