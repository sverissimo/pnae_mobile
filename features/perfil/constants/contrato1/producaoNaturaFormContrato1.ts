import { FormElement } from "../../../../@shared/types/FormElement";

export const producaoNaturaFormContrato1: FormElement[] = [
  {
    field: "gruposNaturaOptions",
    label: "Grupos de produtos in natura",
    type: "navigateToScreen",
    options: [],
  },
  {
    field: "nivel_tecnologico_cultivo",
    label: "Nível Tecnológico de Cultivo",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "sistema_producao",
    label: "Sistema de Produção",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "condicao_posse",
    label: "Condição de Posse",
    type: "selectMultiple",
    options: [],
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
    type: "selectMultiple",
    options: [],
  },
  {
    field: "forma_esgotamento_sanitario",
    label: "Forma de Esgotamento Sanitário",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "tipo_regularizacao_uso_recursos_hidricos",
    label: "Tipo de Regularização do Uso de Recursos Hídricos",
    type: "select",
    options: [],
  },
  {
    field: "atividades_usam_recursos_hidricos",
    label: "Atividades que Usam Recursos Hídricos",
    type: "selectMultiple",
    options: [],
    dependsOn: "tipo_regularizacao_uso_recursos_hidricos",
    dependsOnValues: ["Certidão de uso insignificante", "Outorga"],
  },
  {
    field: "tipo_regularizacao_ambiental",
    label: "Tipo de Regularização Ambiental",
    type: "select",
    options: [],
  },
  {
    field: "atividades_com_regularizacao_ambiental",
    label: "Atividades com Regularização Ambiental",
    type: "selectMultiple",
    options: [],
    dependsOn: "tipo_regularizacao_ambiental",
    dependsOnValues: [
      "Certidão de dispensa de licenciamento",
      "Licença ambiental",
    ],
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
    dependsOn: "possui_cadastro_car",
    dependsOnValues: ["true"],
  },
  {
    field: "ciente_iniciativas_regularizacao_pra",
    label: "Ciente das Iniciativas de Regularização PRA",
    type: "radio",
    dependsOn: "possui_cadastro_car",
    dependsOnValues: ["true"],
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
    type: "selectMultiple",
    options: [],
  },
  {
    field: "valor_total_obtido_pnae",
    label: "Valor Total Obtido PNAE (R$)",
    type: "select",
    options: [],
  },
  {
    field: "valor_total_obtido_outros",
    label: "Valor Total Obtido de Outros (R$)",
    type: "select",
    options: [],
  },
  {
    field: "procedimento_pos_colheita",
    label: "Procedimento Pós-Colheita",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "forma_entrega_produtos",
    label: "Forma de Entrega dos Produtos",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "dificuldade_fornecimento",
    label: "Dificuldade de Fornecimento",
    type: "selectMultiple",
    options: [],
  },
  {
    field: "informacoes_adicionais",
    label: "Informações Adicionais",
    type: "input",
    multiline: true,
    numberOfLines: 4,
  },
];

export const producaoNaturaViewForm: FormElement[] =
  producaoNaturaFormContrato1.filter(
    ({ field }) => field !== "gruposNaturaOptions"
  );
