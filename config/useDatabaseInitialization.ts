import { init_db } from "@infrastructure/database/config/expoSQLite";
import { useState, useEffect } from "react";

export const useDatabaseInitialization = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init_db()
      .then(() => {
        setDbInitialized(true);
        console.log("---------------------------------------\n");
        // checkFiles(); // Uncomment or remove based on your logic
      })
      .catch((err) => {
        console.error("Database initialization error:", err);
      });
  }, []);

  return dbInitialized;
};
