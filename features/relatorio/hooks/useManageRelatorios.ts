import { useContext, useEffect, useState } from "react";

import { env } from "config/env";
import * as Clipboard from "expo-clipboard";

import { ProdutorContext } from "@contexts/ProdutorContext";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useAuth } from "@auth/hooks/useAuth";
import { useLocation } from "@shared/hooks";
import { useManageTecnico } from "@features/tecnico/hooks";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioService } from "@services/RelatorioService";
import { formatDate, locationObjToText, truncateString } from "@shared/utils";

export const useManageRelatorio = (produtorId?: string) => {
  const { relatorios, setRelatorios } = useContext(RelatorioContext);
  const { produtor } = useContext(ProdutorContext);
  const { user } = useAuth();

  const [relatorio, setState] = useState<RelatorioModel>({} as RelatorioModel);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { extensionistas } = useManageTecnico(relatorio);
  const { location, updateLocation } = useLocation();

  useEffect(() => {
    if (produtorId) {
      getRelatorios(produtorId);
    }
  }, [produtorId]);

  useEffect(() => {
    const nomeOutroExtensionista = extensionistas
      .map((e) => e?.nome_usuario)
      .join(",");
    setState((state: any) => ({
      ...state,
      nomeOutroExtensionista,
      outroExtensionista: extensionistas,
    }));
  }, [extensionistas]);

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const updatedLocation = await updateLocation();
      const coordenadas =
        locationObjToText(updatedLocation) || locationObjToText(location);
      const relatorioInput = {
        ...relatorio,
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
        outroExtensionista: extensionistas,
        coordenadas,
      };

      const relatorioId = await RelatorioService.createRelatorio(
        relatorioInput
      );

      setRelatorios([
        ...relatorios,
        {
          ...relatorioInput,
          id: relatorioId,
          nomeTecnico: user?.nome_usuario,
          produtorId: produtor!.id_pessoa_demeter!,
          createdAt: formatDate(new Date().toISOString()),
        },
      ]);
    } catch (error) {
      console.log("🚀 useManageRelatorios.ts:38 ~ error:", error);
    }
  };

  const getRelatorios = async (
    produtorId: string | undefined
  ): Promise<RelatorioModel[]> => {
    if (!produtorId) {
      return [];
    }

    try {
      const relatorios = await RelatorioService.getRelatorios(produtorId);
      if (!relatorios.length) {
        return [];
      }
      setRelatorios(relatorios);
      return relatorios;
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  const updateRelatorio = async (relatorio: RelatorioModel) => {
    const updatedLocation = await updateLocation();
    relatorio.coordenadas =
      locationObjToText(updatedLocation) || locationObjToText(location);

    await RelatorioService.updateRelatorio(relatorio);
    updateRelatoriosList(relatorio);
  };

  const updateRelatoriosList = (relatorio: RelatorioModel) => {
    const updatedRelatorio: RelatorioModel = {
      ...relatorio,
      nomeTecnico: user?.nome_usuario,
    };
    if (relatorio.id) {
      const updatedList = [...relatorios];
      const updateIndex = updatedList.findIndex((r) => r.id === relatorio.id);
      updatedList.splice(updateIndex, 1, updatedRelatorio);
      setRelatorios(updatedList);
      return;
    }

    setRelatorios((relatorios: RelatorioModel[]) => [
      ...relatorios,
      updatedRelatorio,
    ]);
  };

  const onDelete = async (relatorio: RelatorioModel) => {
    setState(relatorio);
    setShowDeleteDialog(true);
  };

  const onConfirmDelete = async () => {
    try {
      await RelatorioService.deleteRelatorio(relatorio.id!);
      const updatedList = relatorios.filter((r) => r.id !== relatorio.id);
      setRelatorios(updatedList);
      setState({} as RelatorioModel);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("🚀 ~ useManageRelatorios.ts ~ line 127", error);
    }
  };

  const getPDFLink = async (relatorioId: any) => {
    try {
      const getPDFUrl = `${env.SERVER_URL}/relatorios/pdf/${relatorioId}`;
      await Clipboard.setStringAsync(getPDFUrl);
      console.log("Copied to Clipboard: ", getPDFUrl);
      return;
    } catch (error) {
      console.log("Clipboard error", error);
    }
  };

  const formatRelatorioRows = (relatorios: RelatorioModel[]) => {
    const relatorioTableData = relatorios.map((r: RelatorioModel) => ({
      id: r?.id,
      numeroRelatorio: r?.numeroRelatorio,
      assunto: truncateString(r?.assunto),
      nomeTecnico: r?.nomeTecnico,
      createdAt: formatDate(r?.createdAt),
      readOnly: r?.readOnly,
    }));
    return relatorioTableData;
  };

  return {
    relatorio,
    setRelatorio: setState,
    relatorios,
    showDeleteDialog,
    getRelatorios,
    handleChange,
    saveRelatorio,
    updateRelatorio,
    setShowDeleteDialog,
    onDelete,
    onConfirmDelete,
    formatRelatorioRows,
    getPDFLink,
  };
};
