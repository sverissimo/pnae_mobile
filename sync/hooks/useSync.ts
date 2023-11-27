import { useContext } from "react";
import { SyncContext } from "@contexts/SyncContext";
import { formatDate } from "@shared/utils";
import { SyncHelpers } from "@sync/SyncHelpers";

const syncHelpers = new SyncHelpers();

export const useLastSyncDate = () => {
  const { lastSync, setLastSync } = useContext(SyncContext);

  const dateToSyncInfo = () => {
    if (!lastSync) {
      return "App não sincronizado";
    }

    const timeZoneAdjustedDate = new Date(lastSync);
    timeZoneAdjustedDate.setHours(timeZoneAdjustedDate.getHours() - 3);
    const timeZoneAdjusted = timeZoneAdjustedDate.toISOString();
    const date = formatDate(timeZoneAdjusted);
    const time = timeZoneAdjusted.split("T")[1].split(".")[0];

    return `Dados sincronizados em ${date} às ${time}`;
  };

  const saveLastSyncDate = async () => {
    const lastSync = await syncHelpers.saveLastSyncDate();
    setLastSync(lastSync);
  };

  return {
    lastSync: dateToSyncInfo(),
    saveLastSyncDate,
  };
};
