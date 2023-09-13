import { db } from "./config";
import { RelatorioLocalDTO } from "./dto";
// import { RelatorioLocalDTO } from "./dto/RelatorioLocalDTO";

export const RelatorioDB = {
  createRelatorio,
  getRelatorios,
  getAllRelatorios,
  updateRelatorio,
  deleteRelatorio,
};

function createRelatorio(relatorio: RelatorioLocalDTO): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!relatorio) {
      reject(new Error("Relatorio is null or undefined"));
      return;
    }

    const keys: (keyof RelatorioLocalDTO)[] = Object.keys(relatorio).filter(
      (key) =>
        relatorio[key as keyof RelatorioLocalDTO] !== null &&
        relatorio[key as keyof RelatorioLocalDTO] !== undefined
    ) as (keyof RelatorioLocalDTO)[];

    const values = keys.map((key) => relatorio[key]);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const queryString = `
      INSERT INTO relatorio (${columns})
      VALUES (${placeholders})
      `;
    // .replace(/produtor_id/g, "CAST(? AS BIGINT)")
    // .replace(/tecnico_id/g, "CAST(? AS BIGINT)")})

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

async function getRelatorios(
  produtorId: string
) /* : Promise<RelatorioLocalDTO>  */ {
  const result = new Promise<RelatorioLocalDTO[]>((resolve, reject) => {
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

function getAllRelatorios(): Promise<RelatorioLocalDTO[]> {
  return new Promise((resolve, reject) => {
    const relatorios: RelatorioLocalDTO[] = [];
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

async function updateRelatorio(relatorio: RelatorioLocalDTO): Promise<boolean> {
  const { id, ...rest } = relatorio;
  const setClause = Object.keys(rest)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(rest);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE relatorio SET ${setClause} WHERE id = ?;`,
        [...values, id],
        (_, result) => {
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

function deleteRelatorio(relatorioId: string) {
  return new Promise<boolean>((resolve, reject) => {
    if (!relatorioId) {
      reject(new Error("RelatorioId is needed to delete an entry."));
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM relatorio WHERE id = ?;`,
        [relatorioId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
            return true;
          } else {
            reject(new Error("O Relatório não foi excluído."));
            return false;
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
