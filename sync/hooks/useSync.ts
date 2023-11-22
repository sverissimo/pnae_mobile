import { SyncHelpers } from "@services/@sync/SyncHelpers";
import { formatDate } from "@shared/utils";
import { useState, useEffect } from "react";

const syncHelpers = new SyncHelpers();

export const useSync = () => {
  const [lastSync, setLastSync] = useState<string>();

  useEffect(() => {
    const fetchLastSync = async () => {
      const lastSyncDate = await syncHelpers.getLastSyncDate();
      setLastSync(lastSyncDate);
    };

    fetchLastSync();
    console.log("🚀 fkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    return () => console.log("unmounting...");
  }, []);

  const dateToSyncInfo = () => {
    if (!lastSync) {
      return "App não sincronizado";
    }

    const date = formatDate(lastSync);
    const time = lastSync.split("T")[1].split(".")[0];

    return `Dados sincronizados em ${date} às ${time}`;
  };

  return {
    lastSync: dateToSyncInfo(),
  };
};
