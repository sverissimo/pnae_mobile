// type any = {
//   id: string;
//   updatedAt: string;
//   [key: string]: any;
// };

export async function syncDBs(
  localRecords: any,
  serverRecords: any
): Promise<{ toUpdateOnServer: any[]; toUpdateOnLocal: any[] }> {
  // Step 1: Create a map of server records for efficient lookup
  const serverRecordsMap = new Map<string, any>();
  serverRecords.forEach((record: any) =>
    serverRecordsMap.set(record.id, record)
  );

  // Step 2: Initialize arrays to hold records that need to be updated on the server and locally
  const toUpdateOnServer: any[] = [];
  const toUpdateOnLocal: any[] = [];

  // Step 3: Iterate over the local records and compare with server records
  for (const localRecord of localRecords) {
    const serverRecord = serverRecordsMap.get(localRecord.id);

    // If the record does not exist on the server, it needs to be created on the server
    if (!serverRecord) {
      toUpdateOnServer.push(localRecord);
      continue;
    }

    // Compare updatedAt timestamps to determine which version is newer
    const localUpdatedAt = new Date(localRecord.updatedAt);
    const serverUpdatedAt = new Date(serverRecord.updatedAt);

    if (localUpdatedAt > serverUpdatedAt) {
      // If the local record is newer, it needs to be updated on the server
      toUpdateOnServer.push(localRecord);
    } else if (localUpdatedAt < serverUpdatedAt) {
      // If the server record is newer, it needs to be updated locally
      toUpdateOnLocal.push(serverRecord);
    }

    // Remove the server record from the map to avoid unnecessary comparisons in the next step
    serverRecordsMap.delete(localRecord.id);
  }

  // Step 4: Any remaining server records are new and need to be created locally
  serverRecordsMap.forEach((serverRecord) =>
    toUpdateOnLocal.push(serverRecord)
  );

  // Step 5: Return the records to be updated on the server and locally
  return { toUpdateOnServer, toUpdateOnLocal };
}

//   // Usage example
//   // (You would replace these with the actual records fetched from your databases)
//   const localRecords: any[] = [
//     { id: '1', updatedAt: '2023-09-15T10:00:00Z', data: 'local1' },
//     { id: '2', updatedAt: '2023-09-15T11:00:00Z', data: 'local2' },
//   ];

//   const serverRecords: any[] = [
//     { id: '1', updatedAt: '2023-09-15T09:00:00Z', data: 'server1' },
//     { id: '3', updatedAt: '2023-09-15T12:00:00Z', data: 'server3' },
//   ];

//   synchronizeRecords(localRecords, serverRecords).then((result) => {
//     console.log('Records to update on server:', result.toUpdateOnServer);
//     console.log('Records to update locally:', result.toUpdateOnLocal);
//   });
