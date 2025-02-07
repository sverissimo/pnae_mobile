import { FormElement } from "../../../@shared/types/FormElement";

export const producaoNaturaForm: FormElement[] = [
  {
    field: "gruposNaturaOptions",
    label: "Grupos de produtos in natura",
    type: "navigateToScreen",
    options: [],
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
    field: "procedimento_pos_colheita",
    label: "Procedimento Pós-Colheita",
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

export const producaoNaturaViewForm: FormElement[] = producaoNaturaForm.filter(
  ({ field }) => field !== "gruposNaturaOptions"
);
