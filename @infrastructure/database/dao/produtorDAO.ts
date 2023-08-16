import { db } from "../config";

export async function getProdutorFromDB(CPFProdutor: string) {
  const result = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Produtor WHERE CPFProdutor = ?`,
        [CPFProdutor],
        (_, { rows }) => {
          resolve(rows.item(0));
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
