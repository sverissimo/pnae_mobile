import { useContext, useEffect, useState } from "react";
import { Share } from "react-native";
import { env } from "@config/env";
import { RelatorioService } from "@services/RelatorioService";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useAuth } from "@auth/hooks/useAuth";
import { useLocation } from "@shared/hooks";
import { useManageTecnico } from "@features/tecnico/hooks";
import { RelatorioModel } from "@features/relatorio/types";
import { formatDate, locationObjToText, truncateString } from "@shared/utils";
// import relatoriosSample from "@config/relatorios.json";

export const useManageRelatorio = (produtorId?: string) => {
  const { produtor } = useContext(ProdutorContext);
  const { relatorios, setRelatorios } = useContext(RelatorioContext);
  const { location, updateLocation } = useLocation();
  const { user } = useAuth();
  console.log(
    "🚀 ~ file: useManageRelatorios.ts:17 ~ useManageRelatorio ~ relatorios:",
    relatorios[2]
  );

  const [relatorio, setState] = useState<RelatorioModel>({} as RelatorioModel);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [enableSave, setEnableSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { extensionistas } = useManageTecnico(relatorio);

  useEffect(() => {
    if (produtorId) {
      (async () => await getRelatorios(produtorId))();
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

  useEffect(() => {
    const validInput = Object.entries(relatorio).every(([key, value]) => {
      const requiredFields = ["assunto", "numeroRelatorio", "orientacao"];
      if (requiredFields.includes(key)) {
        return !!value;
      }
      return true;
    });
    setEnableSave(validInput);
  }, [relatorio]);

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async (relatorio: RelatorioModel) => {
    try {
      // const updatedLocation = await updateLocation();
      // const coordenadas =
      //   locationObjToText(updatedLocation) || locationObjToText(location);
      const coordenadas = locationObjToText(location);
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
          nomeTecnico: user?.nome_usuario || "",
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
      setIsLoading(true);
      const relatorios = await RelatorioService.getRelatorios(produtorId);
      if (!relatorios.length) {
        setIsLoading(false);
        return [];
      }

      setRelatorios(relatorios);
      setIsLoading(false);
      return relatorios;
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  const updateRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const coordenadas = locationObjToText(location);
      // || await updateLocation();
      //relatorio.coordenadas = locationObjToText(updatedLocation) || locationObjToText(location);
      const relatorioUpdate = {
        ...relatorio,
        tecnicoId: user!.id_usuario,
        coordenadas,
      };

      await RelatorioService.updateRelatorio(relatorioUpdate);
      updateRelatoriosList(relatorioUpdate);
    } catch (error) {
      console.error("🚀 ~ file: useManageRelatorios.ts:118:", error);
      throw error;
    }
  };

  const updateRelatoriosList = (relatorio: RelatorioModel) => {
    const updatedRelatorio: RelatorioModel = {
      ...relatorio,
      nomeTecnico: user?.nome_usuario || "",
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

  const sharePDFLink = async (relatorioId: string | number) => {
    const { numeroRelatorio } = relatorios.find(
      (relatorio) => relatorio.id === relatorioId
    )!;
    const nomeProdutor = produtor?.nm_pessoa;
    const url = `${env.SERVER_URL}/relatorios/pdf/${relatorioId}`;
    try {
      const result = await Share.share(
        {
          title: `Relatório nº${numeroRelatorio} - PNAE Mobile APP`,
          url: "../../../assets/images/logo.png",
          message: `Link para o PDF \nProdutor ${nomeProdutor} \nRelatório nº${numeroRelatorio}
          \n${url}`,
        },
        { dialogTitle: "Compartilhar Relatório" }
      );
      if (result.action === Share.sharedAction) {
        console.info("🚀 useManageRelatorios.ts:185 ~ sharePDFLink:", result);
      }
    } catch (error: any) {
      console.error("🚀 RelatorioScreen.tsx:49:", error);
    }
  };

  return {
    relatorio,
    relatorios,
    showDeleteDialog,
    enableSave,
    isLoading,
    setRelatorio: setState,
    getRelatorios,
    handleChange,
    saveRelatorio,
    updateRelatorio,
    setShowDeleteDialog,
    onDelete,
    onConfirmDelete,
    formatRelatorioRows,
    sharePDFLink,
    setEnableSave,
  };
};
