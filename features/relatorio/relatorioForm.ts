import { FormElement } from "../../@shared/types/FormElement";

export const relatorioForm: FormElement[] = [
  {
    field: "numeroRelatorio",
    label: "Número do Relatório",
    type: "input",
  },
  {
    field: "assunto",
    label: "Assunto",
    type: "input",
  },
  {
    field: "orientacao",
    label: "Orientação",
    type: "input",
  },
  {
    field: "pictureURI",
    label: "Foto",
    type: "input",
  },
  {
    field: "assinaturaURI",
    label: "Assinatura",
    type: "input",
  },
];
