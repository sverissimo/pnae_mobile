import { FormElement } from "@shared/types";

export const produtoDetailsForm: FormElement[] = [
  {
    field: "area_utilizada",
    label: "Área utilizada",
    type: "input",
    keyboardType: "numeric",
  },
  {
    field: "producao_aproximada_ultimo_ano_pnae",
    label: "Produção aproximada no último ano (PNAE)",
    type: "input",
    keyboardType: "numeric",
  },
  {
    field: "producao_aproximada_ultimo_ano_total",
    label: "Produção aproximada no último ano (Total)",
    type: "input",
    keyboardType: "numeric",
  },
];
