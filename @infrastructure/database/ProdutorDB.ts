import { db } from "./config";

export const ProdutorDB = {
  getProdutor: (CPFProdutor: string) => {
    console.log({ tst: this });
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
  },
};
