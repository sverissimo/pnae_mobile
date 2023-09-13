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
    icon: "file-edit-outline",
    iconAlt: "file-document-edit",
  },
  {
    field: "pictureURI",
    label: "Foto",
    type: "image",
    buttonLabel: "Registrar foto",
    buttonLabelAlt: "Alterar foto",
    icon: "camera-outline",
    iconAlt: "camera",
  },
  {
    field: "assinaturaURI",
    label: "Assinatura",
    type: "signature",
    buttonLabel: "Adicionar Assinatura",
    buttonLabelAlt: "Alterar Assinatura",
    icon: "pencil-outline",
    iconAlt: "pen-remove",
  },
  {
    field: "matriculaOutroExtensionista",
    label: "Outro extensionista? (inserir nº matrícula)",
    type: "input",
    customHelperField: "nomeOutroExtensionista",
    keyboardType: "numeric",
    placeholder: "nº matrícula sem dígito",
    maxLength: 36,
    buttonLabel: "Adicionar Extensionista",
    buttonLabelAlt: "Alterar Extensionista",
    icon: "account-outline",
    iconAlt: "account-edit",
  },
];
