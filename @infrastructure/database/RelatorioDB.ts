import { Relatorio } from "features/relatorio/types/Relatorio";
import { db } from "./config";
import { RelatorioDTO } from "./dto/RelatorioDTO";
import { createQueryString } from "./utils/createQueryString";

export const RelatorioDB = {
  createRelatorio,
  getRelatorios,
  getAllRelatorios,
  updateRelatorio,
  deleteRelatorio,
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

async function getRelatorios(
  produtorId: string
) /* : Promise<RelatorioDTO>  */ {
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

function getAllRelatorios(): Promise<RelatorioDTO[]> {
  return new Promise((resolve, reject) => {
    const relatorios: RelatorioDTO[] = [];
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

function updateRelatorio(relatorio: Partial<RelatorioDTO> & { id: string }) {
  console.log(
    "🚀 ~ file: RelatorioDB.ts:101 ~ updateRelatorio ~ relatorio:",
    relatorio
  );
  return new Promise<void | boolean>((resolve, reject) => {
    if (!relatorio) {
      reject(new Error("Relatorio is null or undefined"));
      return;
    }

    const { values, setClause } = createQueryString(relatorio);

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE relatorio SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        [...values, relatorio.id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(true);
            return true;
          } else {
            reject(new Error("O Relatório não foi atualizado."));
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
