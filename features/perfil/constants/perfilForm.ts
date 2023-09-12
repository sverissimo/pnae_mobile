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
    field: "atividade",
    label: "Atividade Desenvolvida",
    type: "select",
    options: ["ATIVIDADE_PRIMARIA", "ATIVIDADE_SECUNDARIA", "AMBAS"],
  },
];
