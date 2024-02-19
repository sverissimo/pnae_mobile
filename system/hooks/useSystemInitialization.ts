import { checkFiles, fileExists } from "@shared/utils";
import { useState, useEffect } from "react";
import { SystemUtils } from "system/SystemUtils";

export const useSystemInitialization = () => {
  const [systemInitialized, setSystemInitialized] = useState(false);

  useEffect(() => {
    SystemUtils.init_system()
      .then(() => {
        setSystemInitialized(true);
        console.log("---------------------------------------\n");
      })
      .catch((err) => {
        console.error("Database initialization error:", err);
      });
  }, []);

  return systemInitialized;
};
