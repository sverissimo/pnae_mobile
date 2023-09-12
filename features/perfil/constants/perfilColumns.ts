export const PERFIL_COLUMNS = [
  //{ key: "id", label: "ID" },
  { key: "tipo_perfil", label: "Tipo de Perfil" },
  { key: "nome_tecnico", label: "Técnico" },
  { key: "data_preenchimento", label: "Data de Preenchimento" },
  { key: "data_atualizacao", label: "Data de Atualização", action: "edit" },
  {
    key: "options",
    label: "Visualizar",
    styles: {
      flex: 1.3,
    },
    icons: [{ iconName: "search", action: "view" }],
  },
];
