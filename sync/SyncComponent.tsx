import { useSyncRelatorios } from "sync/hooks/useSyncRelatorios";
import { useSyncAtendimentos } from "./hooks/useSyncAtendimentos";
import { useSyncUsuarios } from "./hooks/useSyncUsuarios";
import { useSyncPerfilOptions } from "./hooks/useSyncPerfilOptions";

//TODO: Criar Sync Context para controlar o estado de sincronização
export const SyncComponent = () => {
  console.log("----------------");
  useSyncRelatorios();
  useSyncAtendimentos();
  useSyncUsuarios();
  useSyncPerfilOptions();
  //   useSyncProdutores();
  return <></>;
};
