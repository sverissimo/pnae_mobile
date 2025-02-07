export const PERFIL_COLUMNS = [
  //{ key: "id", label: "ID" },
  { key: "tipo_perfil", label: "Tipo de Perfil" },
  { key: "nome_tecnico", label: "Técnico" },
  { key: "data_preenchimento", label: "Criado em" },
  { key: "id_contrato", label: "Contrato", action: "edit" },
  {
    key: "options",
    label: "Visualizar",
    styles: {
      flex: 1.3,
    },
    icons: [{ iconName: "search", action: "view" }],
  },
];
