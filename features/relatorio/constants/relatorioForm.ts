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
    type: "textEditor",
    buttonLabel: "Inserir Orientação",
    buttonLabelAlt: "Alterar Orientação",
    icon: "file-document-edit-outline",
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
