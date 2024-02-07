const alterRelatorioTable =
  'ALTER TABLE "Relatorio" ADD COLUMN tecnico_id TEXT;';

export const addOutroExtRelatorioTable = `
ALTER TABLE "relatorio" ADD COLUMN outro_extensionista TEXT;
`;

export const addReadOnlyRelatorioTable = `
ALTER TABLE "relatorio" ADD COLUMN read_only BOOLEAN;
`;

export const addCoordsRelatorioTable = `
ALTER TABLE "relatorio" ADD COLUMN coordenadas TEXT;
`;

export const addContratoIdColumn = `
ALTER TABLE "relatorio" ADD COLUMN id_contrato INTEGER;
`;
