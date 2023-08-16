export const createRelatorioTableQuery = `
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
`;
