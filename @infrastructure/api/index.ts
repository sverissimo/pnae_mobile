//@index('./*', f => `export * from '${f.path}/${(f.path).replace('./', '')}API'`)
export * from "./API";
export * from "./atendimento/repository/AtendimentoAPIRepository";
export * from "./files/FileAPI";
export * from "./perfil/PerfilAPIRepository";
export * from "./produtor/ProdutorAPIRepository";
export * from "./relatorio/repository/RelatorioAPIRepository";
export * from "./usuario/UsuarioAPIRepository";
