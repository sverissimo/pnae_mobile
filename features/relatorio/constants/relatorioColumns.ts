export const RELATORIO_COLUMNS = [
  //{ key: "id", label: "ID" },
  {
    key: "numeroRelatorio",
    label: "Número",
    styles: {
      flex: 0.7,
    },
  },
  { key: "assunto", label: "Assunto", styles: {} },
  { key: "nomeTecnico", label: "Técnico", styles: {} },
  { key: "createdAt", label: "Data", styles: {} },
  {
    key: "options",
    label: "Opções",
    styles: {
      flex: 1.3,
    },
    icons: [
      { iconName: "search", action: "view" },
      { iconName: "file-pdf-o", color: "darkred", action: "getPDF" },
      { iconName: "pencil", color: "blue", action: "edit" },
      {
        iconName: "trash",
        color: "#555",
        action: "delete",
      },
    ],
  },
];
