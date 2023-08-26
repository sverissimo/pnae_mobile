import { Relatorio } from "features/relatorio/types/Relatorio";
import { db } from "./config";
import { RelatorioDTO } from "./dto/RelatorioDTO";

export const RelatorioDB = {
  createRelatorio,
  getRelatorios,
  getAllRelatorios,
  updateRelatorio,
};

function createRelatorio(relatorio: RelatorioDTO): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!relatorio) {
      reject(new Error("Relatorio is null or undefined"));
      return;
    }

    const keys: (keyof Relatorio)[] = Object.keys(relatorio).filter(
      (key) =>
        relatorio[key as keyof Relatorio] !== null &&
        relatorio[key as keyof Relatorio] !== undefined
    ) as (keyof Relatorio)[];

    const values = keys.map((key) => relatorio[key]);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const queryString = `
      INSERT INTO relatorio (${columns})
      VALUES (${placeholders
        .replace(/produtor_id/g, "CAST(? AS BIGINT)")
        .replace(/tecnico_id/g, "CAST(? AS BIGINT)")})
    `;

    db.transaction((tx) => {
      tx.executeSql(
        queryString,
        values,
        () => {
          resolve(true);
          return true;
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async function getRelatorios(produtorId: any) /* : Promise<RelatorioDTO>  */ {
  const result = new Promise<RelatorioDTO[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
    SELECT * FROM relatorio WHERE produtor_id = ?;
    `,
        [produtorId],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

  return result;
}

function getAllRelatorios(): Promise<Relatorio[]> {
  return new Promise((resolve, reject) => {
    const relatorios: Relatorio[] = [];
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM relatorio;",
        [],
        (_, { rows: { _array } }) => {
          _array.forEach((relatorio) => {
            relatorios.push(relatorio);
          });
          resolve(relatorios);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

function updateRelatorio(id: number, assunto: string, orientacao: string) {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE relatorio SET assunto = ?, orientacao = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;",
      [assunto, orientacao, id]
    );
  });
}

/* export const insertRelatorio = (relatorio: Relatorio) => {
  if (!relatorio) return;
  const relatorioValues = Object.values(relatorio).map(
    (value) => value ?? "NULL"
  );

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO relatorio (
        produtor_id,
        tecnico_id,
        nr_relatorio,
        assunto,
        orientacao,
        picture_uri,
        assinatura_uri
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      relatorioValues
    );
  });
}; */
