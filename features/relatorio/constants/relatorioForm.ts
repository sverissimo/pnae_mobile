import { FormElement } from "../../../@shared/types/FormElement";

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
    type: "image",
    buttonLabel: "Registrar foto",
    buttonLabelAlt: "Alterar foto",
    icon: "camera",
  },
  {
    field: "assinaturaURI",
    label: "Assinatura",
    type: "signature",
    buttonLabel: "Adicionar Assinatura",
    buttonLabelAlt: "Alterar Assinatura",
    icon: "pen",
    //icon: "signature",
  },
];
