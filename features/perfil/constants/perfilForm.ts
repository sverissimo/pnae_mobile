import { FormElement } from "../../../@shared/types/FormElement";

export const perfilForm: FormElement[] = [
  {
    field: "tipo_perfil",
    label: "Tipo de Perfil",
    type: "select",
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
    options: ["Baixo", "Moderado", "Alto"],
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
  },
  {
    field: "atividade",
    label: "Atividade Desenvolvida",
    type: "select",
  },
];
