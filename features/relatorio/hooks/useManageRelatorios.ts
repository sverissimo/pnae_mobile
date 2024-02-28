import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Share } from "react-native";
import { env } from "@config/env";
import { RelatorioService } from "@services/relatorio/RelatorioService";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useAuth } from "@auth/hooks/useAuth";
import { useLocation, useManageConnection } from "@shared/hooks";
import { useManageTecnico } from "@features/tecnico/hooks";
import { RelatorioModel } from "@features/relatorio/types";
import { formatDate, truncateString } from "@shared/utils";
import { useManageContratos } from "@shared/hooks/useManageContratos";
import { Relatorio } from "@domain/relatorio";
import { RelatorioDomainService } from "@domain/relatorio/services";

export const useManageRelatorio = (produtorId?: string) => {
  const { produtor } = useContext(ProdutorContext);
  const { relatorios, setRelatorios } = useContext(RelatorioContext);

  const { getLocation } = useLocation();
  const { isConnected, connectionType } = useManageConnection();
  const { activeContrato } = useManageContratos();

  const { user } = useAuth();

  const [relatorio, setState] = useState<RelatorioModel>({} as RelatorioModel);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [enableSave, setEnableSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdToday, setCreatedToday] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(false);

  const { extensionistas } = useManageTecnico(relatorio);

  useLayoutEffect(() => {
    if (produtorId) {
      (async () => {
        setIsLoading(true);
        await getRelatorios(produtorId);
      })();
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

  useEffect(() => {
    const checkCreateLimits = async () => {
      const createdToday =
        RelatorioDomainService.checkForCreatedToday(relatorios);

      const allRelatoriosLocal =
        await new RelatorioService().getLocalRelatorios();

      const reachedDailyLimit = RelatorioDomainService.getCreateLimit(
        allRelatoriosLocal,
        user!.id_usuario
      );

      setCreatedToday(createdToday);
      setDailyLimit(reachedDailyLimit);
    };

    checkCreateLimits();
  }, [relatorios]);

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async (relatorioInput: RelatorioModel) => {
    try {
      const coordenadas = getLocation();
      const propriedade = produtor!.propriedades![0];

      const relatorio = {
        ...relatorioInput,
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
        contratoId: activeContrato?.id_contrato!,
        outroExtensionista: extensionistas,
        coordenadas,
      };

      const connected = !!isConnected;
      const relatorioModel = new Relatorio(relatorio).create();

      const atendimento = {
        id_usuario: user!.id_usuario,
        id_pessoa_demeter: produtor!.id_pessoa_demeter,
        id_pl_propriedade: propriedade.id_pl_propriedade,
        id_und_empresa: propriedade.id_und_empresa,
        id_relatorio: relatorioModel.id,
      };

      const atendimentoId = await new RelatorioService({
        isConnected: !!connected,
      }).createRelatorio(relatorioModel, atendimento);

      console.log("🚀 - saveRelatorio - atendimentoId:", atendimentoId);

      const relatorioView = {
        ...relatorioModel,
        nomeTecnico: user?.nome_usuario || "",
        produtorId: produtor!.id_pessoa_demeter!,
        createdAt: formatDate(relatorioModel.createdAt),
        atendimentoId,
      };

      setRelatorios([...relatorios, relatorioView]);
    } catch (error) {
      console.log("🚀 useManageRelatorios.ts:38 ~ error:", error);
      throw error;
    }
  };

  const getRelatorios = async (
    produtorId: string | undefined
  ): Promise<RelatorioModel[]> => {
    if (!produtorId) {
      return [];
    }
    try {
      const relatorios = await new RelatorioService({
        isConnected: !!isConnected,
      }).getRelatorios(produtorId);
      if (!relatorios.length) {
        setIsLoading(false);
        return [];
      }

      setRelatorios(relatorios);
      setIsLoading(false);
      return relatorios;
    } catch (error) {
      console.error("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  const updateRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const relatorioUpdate = {
        ...relatorio,
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
        contratoId:
          Number(relatorio.contratoId) || activeContrato?.id_contrato!,
      };

      await new RelatorioService({
        isConnected: !!isConnected,
      }).updateRelatorio(relatorioUpdate);

      updateRelatoriosList(relatorioUpdate);
    } catch (error) {
      console.log("🚀 ~ file: useManageRelatorios.ts:118:", error);
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
      const connected = !!(isConnected && connectionType !== "unknown");
      await new RelatorioService({ isConnected: connected }).deleteRelatorio(
        relatorio.id!
      );

      const updatedList = relatorios.filter((r) => r.id !== relatorio.id);
      setRelatorios(updatedList);
      setState({} as RelatorioModel);
      setShowDeleteDialog(false);
    } catch (error) {
      console.log("🚀 ~ useManageRelatorios.ts ~ line 127", error);
    }
  };

  const formatRelatorioRows = (relatorios: RelatorioModel[]) => {
    const preventDelete = (r: RelatorioModel) =>
      !isConnected || r.nomeTecnico !== user?.nome_usuario;

    const relatorioTableData = relatorios.map((r: RelatorioModel) => ({
      id: r?.id,
      numeroRelatorio: r?.numeroRelatorio,
      assunto: truncateString(r?.assunto),
      nomeTecnico: r?.nomeTecnico,
      createdAt: formatDate(r?.createdAt),
      readOnly: r?.readOnly,
      preventDelete: preventDelete(r),
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
    createdToday,
    dailyLimit,
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
