import { FormElement } from "../../@shared/types/FormElement";

export const relatorioForm: FormElement[] = [
  {
    field: "numeroRelatorio",
    label: "Número do Relatório",
    type: "input",
    keyboardType: "numeric",
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
    type: "button",
    buttonLabel: "Registrar foto",
    icon: "camera",
  },
  {
    field: "assinaturaURI",
    label: "Assinatura",
    type: "button",
    buttonLabel: "Adicionar Assinatura",
    icon: "pen",
    //icon: "signature",
  },
];
