import { FormElement } from "../../../@shared/types/FormElement";

export const producaoIndustrialForm: FormElement[] = [
  {
    field: "gruposIndustrialOptions",
    label: "Grupos de Produtos da Agroindústria",
    type: "navigateToScreen",
    options: [],
  },
  {
    field: "local_comercializacao2",
    label: "Local de Comercialização",
    type: "selectMultiple",
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
    field: "orgao_fiscalizacao_sanitaria",
    label: "Órgão de Fiscalização Sanitária",
    type: "select",
    options: [],
  },
  {
    field: "controla_custos_producao2",
    label: "Controla Custos de Produção",
    type: "radio",
    key: "controla_custos_producao2",
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

export const producaoIndustrialViewForm = producaoIndustrialForm.filter(
  ({ field }) => field !== "gruposIndustrialOptions"
);
