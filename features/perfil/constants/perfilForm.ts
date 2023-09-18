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
    options: ["Atividade Primária", "Atividade Secundária", "Ambas"],
  },
];

export const viewPerfilForm: FormElement[] = [
  {
    field: "tipo_perfil",
    label: "Tipo de Perfil",
    type: "select",
    options: ["ENTRADA", "SAÍDA"],
  },
  {
    field: "municipio",
    label: "Município",
    type: "input",
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
    options: ["BAIXO", "MODERADO", "ALTO"],
  },
  {
    field: "atividade",
    label: "Atividade Desenvolvida",
    type: "select",
    options: ["Atividade Primária", "Atividade Secundária", "Ambas"],
  },
];
