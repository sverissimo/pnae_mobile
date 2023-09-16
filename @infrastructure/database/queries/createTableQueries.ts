/* export const createRelatorioTableQuery = `
--drop table relatorio;
CREATE TABLE IF NOT EXISTS "relatorio" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produtor_id BIGINT,
    tecnico_id BIGINT,
    numero_relatorio INTEGER,
    assunto TEXT,
    orientacao TEXT,
    picture_uri TEXT,
    assinatura_uri TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
  );
`; */

export const createRelatorioTableQuery = `
CREATE TABLE IF NOT EXISTS "relatorio" (
  id TEXT PRIMARY KEY,
  produtor_id TEXT,
  tecnico_id TEXT,
  numero_relatorio INTEGER,
  assunto TEXT,
  orientacao TEXT,
  picture_uri TEXT,
  assinatura_uri TEXT,
  outro_extensionista TEXT,
  read_only BOOLEAN,
  coordenadas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
`;

export const migrateData = `
INSERT INTO "new_relatorio" (
  id,
  produtor_id,
  tecnico_id,
  numero_relatorio,
  assunto,
  orientacao,
  picture_uri,
  assinatura_uri,
  created_at,
  updated_at
)
SELECT
  CAST(id AS TEXT),
  produtor_id,
  tecnico_id,
  numero_relatorio,
  assunto,
  orientacao,
  picture_uri,
  assinatura_uri,
  created_at,
  updated_at
FROM "relatorio";
`;

export const dropRelatorioTableQuery = `
DROP TABLE "relatorio";
`;

export const renameRelatorioTableQuery = `
ALTER TABLE "new_relatorio" RENAME TO "relatorio";
`;
